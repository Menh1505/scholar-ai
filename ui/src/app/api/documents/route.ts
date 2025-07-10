import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { documentId, completed } = await req.json();

    if (!documentId || typeof completed !== "boolean") {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // TODO: In real app, update document status in database
    // For now, we'll just return success
    console.log(`Document ${documentId} marked as ${completed ? "completed" : "incomplete"}`);

    return NextResponse.json({
      success: true,
      message: `Document ${documentId} updated successfully`,
    });
  } catch (error) {
    console.error("Update document error:", error);
    return NextResponse.json({ error: "Failed to update document status" }, { status: 500 });
  }
}
