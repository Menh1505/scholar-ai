import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ result: "database not found" });

  return NextResponse.json({ result: "connected database" });
}
