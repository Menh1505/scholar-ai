import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI as string);

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Simple in-memory rate limiting
const requestLog = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // Max 30 requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Simple in-memory cache
const chatCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 1000; // 10 seconds cache

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const userLog = requestLog.get(userId);

  if (!userLog || now > userLog.resetTime) {
    requestLog.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }

  if (userLog.count >= RATE_LIMIT) {
    return true;
  }

  userLog.count++;
  return false;
}

function getCachedData(userId: string): any | null {
  const cached = chatCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedData(userId: string, data: any): void {
  chatCache.set(userId, { data, timestamp: Date.now() });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Rate limiting check
    if (isRateLimited(userId)) {
      console.log(`🚫 Rate limited user ${userId}`);
      return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
    }

    // Check cache first
    const cachedData = getCachedData(userId);
    if (cachedData) {
      console.log(`⚡ Serving cached data for user ${userId}`);
      return NextResponse.json(cachedData);
    }

    console.log(`🔍 Fetching chat history for user ${userId}`);

    await client.connect();
    const db = client.db("scholar");
    const collection = db.collection("chatHistory");

    const chatHistory = await collection.findOne({ userId });
    const result = { messages: chatHistory?.messages || [] };

    // Cache the result
    setCachedData(userId, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { role, content } = body;

    if (!role || !content) {
      return NextResponse.json({ error: "Role and content are required" }, { status: 400 });
    }

    await client.connect();
    const db = client.db("scholar");
    const collection = db.collection("chatHistory");

    const newMessage: ChatMessage = {
      role,
      content,
      timestamp: new Date(),
    };

    // Thêm tin nhắn mới và giữ tối đa 20 tin nhắn gần nhất
    await collection.updateOne(
      { userId },
      {
        $push: {
          messages: {
            $each: [newMessage],
            $slice: -20, // Giữ 20 tin nhắn cuối
          },
        } as any,
        $set: { updatedAt: new Date() },
      },
      { upsert: true }
    );

    // Invalidate cache after update
    chatCache.delete(userId);
    console.log(`🗑️ Cache invalidated for user ${userId} after POST`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving chat message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    await client.connect();
    const db = client.db("scholar");
    const collection = db.collection("chatHistory");

    await collection.deleteOne({ userId });

    // Invalidate cache after delete
    chatCache.delete(userId);
    console.log(`🗑️ Cache invalidated for user ${userId} after DELETE`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}
