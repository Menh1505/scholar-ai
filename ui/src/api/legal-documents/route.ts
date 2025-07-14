import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI as string);

interface LegalDocument {
  id: string;
  name: string;
  description: string;
  required: boolean;
  completed: boolean;
  completedAt?: Date;
  fileName?: string;
  analysisId?: string;
  note?: string;
}

// Mapping document types to legal document IDs
const DOCUMENT_TYPE_MAPPING: { [key: string]: string } = {
  passport: "passport",
  transcript: "transcript",
  "bank statement": "bank-statement",
  "i-20": "i20-form",
  "recommendation letter": "lor",
  "statement of purpose": "sop",
  "english certificate": "english-cert",
  "financial statement": "bank-statement",
  diploma: "transcript",
  "degree certificate": "transcript",
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { documentType, fileName, analysisId, confirmed } = body;

    if (!documentType || !fileName || !analysisId) {
      return NextResponse.json(
        {
          error: "Missing required fields: documentType, fileName, analysisId",
        },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;

    await client.connect();
    const db = client.db("scholar");

    // Find corresponding legal document ID
    const legalDocId = findLegalDocumentId(documentType);

    if (!legalDocId) {
      return NextResponse.json(
        {
          error: "Document type not recognized for legal requirements",
        },
        { status: 400 }
      );
    }

    // Get user's current legal documents
    const userCollection = db.collection("users");
    const user = await userCollection.findOne({ _id: userId });

    const currentLegalDocuments = user?.legalDocuments || getDefaultLegalDocuments();

    // Find the document to update
    const docIndex = currentLegalDocuments.findIndex((doc: LegalDocument) => doc.id === legalDocId);

    if (docIndex === -1) {
      return NextResponse.json(
        {
          error: "Legal document not found",
        },
        { status: 404 }
      );
    }

    if (confirmed) {
      // User confirmed - mark as completed
      const updatedDocuments = [...currentLegalDocuments];
      updatedDocuments[docIndex] = {
        ...updatedDocuments[docIndex],
        completed: true,
        completedAt: new Date(),
        fileName,
        analysisId,
        note: `Document verified and approved by AI analysis`,
      };

      // Update user's legal documents
      await userCollection.updateOne(
        { _id: userId },
        {
          $set: {
            legalDocuments: updatedDocuments,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      // Save action log
      const actionLogCollection = db.collection("actionLogs");
      await actionLogCollection.insertOne({
        userId,
        action: "document_completed",
        documentType,
        documentId: legalDocId,
        fileName,
        timestamp: new Date(),
      });

      console.log(`✅ Legal document ${legalDocId} marked as completed for user ${userId}`);

      return NextResponse.json({
        success: true,
        message: "Document successfully added to your legal documents list",
        updatedDocument: updatedDocuments[docIndex],
      });
    } else {
      // Just return the document that would be updated for confirmation
      return NextResponse.json({
        success: true,
        documentToUpdate: currentLegalDocuments[docIndex],
        message: "Document analysis complete. Please confirm to add to your legal documents.",
      });
    }
  } catch (error) {
    console.error("Error updating legal documents:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    await client.connect();
    const db = client.db("scholar");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ _id: userId });
    const legalDocuments = user?.legalDocuments || getDefaultLegalDocuments();

    return NextResponse.json({
      legalDocuments,
    });
  } catch (error) {
    console.error("Error fetching legal documents:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

function findLegalDocumentId(documentType: string): string | null {
  const normalizedType = documentType.toLowerCase().trim();

  // Check direct mapping first
  if (DOCUMENT_TYPE_MAPPING[normalizedType]) {
    return DOCUMENT_TYPE_MAPPING[normalizedType];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(DOCUMENT_TYPE_MAPPING)) {
    if (normalizedType.includes(key) || key.includes(normalizedType)) {
      return value;
    }
  }

  return null;
}

function getDefaultLegalDocuments(): LegalDocument[] {
  return [
    {
      id: "transcript",
      name: "Bằng cấp, bảng điểm",
      description: "Cấp 3, đại học (dịch thuật công chứng)",
      required: true,
      completed: false,
    },
    {
      id: "english-cert",
      name: "Chứng chỉ tiếng Anh",
      description: "TOEFL iBT ≥ 71–100, IELTS ≥ 6.0–7.5",
      required: true,
      completed: false,
    },
    {
      id: "passport",
      name: "Hộ chiếu",
      description: "Còn hạn ≥ 6 tháng sau ngày dự kiến nhập cảnh",
      required: true,
      completed: false,
    },
    {
      id: "sop",
      name: "SOP (Statement of Purpose)",
      description: "Tự luận mục tiêu học tập",
      required: true,
      completed: false,
    },
    {
      id: "lor",
      name: "LOR (Letter of Recommendation)",
      description: "1–3 thư giới thiệu từ giáo viên/cấp trên",
      required: true,
      completed: false,
    },
    {
      id: "bank-statement",
      name: "Sổ tiết kiệm ngân hàng",
      description: "Số dư đủ chi trả ít nhất 1 năm học phí + sinh hoạt",
      required: true,
      completed: false,
    },
    {
      id: "i20-form",
      name: "Form I-20",
      description: "Trường cấp sau khi được nhận và xác minh tài chính",
      required: true,
      completed: false,
    },
  ];
}
