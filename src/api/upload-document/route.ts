import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { MongoClient } from "mongodb";
import mammoth from "mammoth";

const client = new MongoClient(process.env.MONGO_URI as string);

// Supported file types
const SUPPORTED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "text/plain"];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface DocumentAnalysis {
  fileName: string;
  fileType: string;
  fileSize: number;
  extractedText: string;
  analysisResult: {
    documentType: string;
    isValid: boolean;
    missingRequirements: string[];
    suggestions: string[];
    confidence: number;
  };
  uploadedAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const documentType = formData.get("documentType") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (!SUPPORTED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Unsupported file type. Please upload PDF, DOCX, DOC, or TXT files only.",
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File too large. Maximum size is 10MB.",
        },
        { status: 400 }
      );
    }

    console.log(`📄 Processing file: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);

    // Extract text from file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    try {
      switch (file.type) {
        case "application/pdf":
          // Dynamic import for pdf-parse to avoid build issues
          const pdfParse = (await import("pdf-parse")).default;
          const pdfData = await pdfParse(buffer);
          extractedText = pdfData.text;
          break;

        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/msword":
          const docxResult = await mammoth.extractRawText({ buffer });
          extractedText = docxResult.value;
          break;

        case "text/plain":
          extractedText = buffer.toString("utf-8");
          break;

        default:
          throw new Error("Unsupported file type");
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      return NextResponse.json(
        {
          error: "Failed to extract text from file. Please check if the file is corrupted.",
        },
        { status: 500 }
      );
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        {
          error: "No text content found in the file.",
        },
        { status: 400 }
      );
    }

    console.log(`✅ Extracted ${extractedText.length} characters from ${file.name}`);

    // Analyze document with OpenAI
    const analysisResult = await analyzeDocument(extractedText, documentType);

    // Save to database
    const userId = (session.user as any).id;
    const documentAnalysis: DocumentAnalysis = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      extractedText: extractedText.substring(0, 5000), // Store first 5000 chars
      analysisResult,
      uploadedAt: new Date(),
    };

    await client.connect();
    const db = client.db("scholar");
    const collection = db.collection("documentAnalysis");

    await collection.insertOne({
      userId,
      ...documentAnalysis,
    });

    console.log(`💾 Document analysis saved for user ${userId}`);

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      fileName: file.name,
    });
  } catch (error) {
    console.error("Error processing document:", error);
    return NextResponse.json(
      {
        error: "Internal server error during document processing",
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

async function analyzeDocument(text: string, documentType: string): Promise<DocumentAnalysis["analysisResult"]> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a legal document analysis expert specializing in US study abroad documentation. 
Analyze the provided document and determine:
1. Document type (passport, transcript, bank statement, I-20, etc.)
2. Whether it meets US study abroad requirements
3. What's missing or needs improvement
4. Suggestions for compliance
5. Confidence level (0-100%)

Response format (JSON):
{
  "documentType": "string",
  "isValid": boolean,
  "missingRequirements": ["string"],
  "suggestions": ["string"],
  "confidence": number
}`,
          },
          {
            role: "user",
            content: `Document type hint: ${documentType || "unknown"}
            
Document content:
${text.substring(0, 4000)}`, // Limit to 4000 chars for API
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      documentType: result.documentType || "Unknown",
      isValid: result.isValid || false,
      missingRequirements: result.missingRequirements || [],
      suggestions: result.suggestions || [],
      confidence: result.confidence || 0,
    };
  } catch (error) {
    console.error("Error analyzing document with OpenAI:", error);

    // Fallback analysis
    return {
      documentType: "Unknown",
      isValid: false,
      missingRequirements: ["Unable to analyze document"],
      suggestions: ["Please try uploading the document again or contact support"],
      confidence: 0,
    };
  }
}
