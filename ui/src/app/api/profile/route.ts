import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI as string);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await client.connect();
    const db = client.db("scholar");
    const collection = db.collection("userProfiles");

    const userProfile = await collection.findOne({ userId: (session.user as any).id });

    return NextResponse.json({ userProfile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
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

    const body = await request.json();
    const { fullname, phone, dateOfBirth, nationality, passportCode, passportExpiryDate } = body;

    await client.connect();
    const db = client.db("scholar");
    const collection = db.collection("userProfiles");

    const userProfile = {
      userId: (session.user as any).id,
      email: session.user.email,
      fullname,
      phone,
      dateOfBirth,
      nationality,
      passportCode,
      passportExpiryDate,
      scholarPoints: 100, // Welcome bonus
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.updateOne({ userId: (session.user as any).id }, { $set: userProfile }, { upsert: true });

    return NextResponse.json({
      success: true,
      userProfile,
      upserted: result.upsertedId ? true : false,
    });
  } catch (error) {
    console.error("Error saving user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    await client.connect();
    const db = client.db("scholar");
    const collection = db.collection("userProfiles");

    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    const result = await collection.updateOne({ userId: (session.user as any).id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}
