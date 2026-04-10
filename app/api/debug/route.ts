import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { USE_MEMORY_DB } from "@/lib/inMemoryDB";
import mongoose from "mongoose";

export async function GET() {
  const info: Record<string, unknown> = {
    USE_MEMORY_DB,
    MONGODB_URI_SET: !!process.env.MONGODB_URI,
    MONGODB_URI_PREFIX: process.env.MONGODB_URI?.substring(0, 30) + "...",
  };

  if (!USE_MEMORY_DB) {
    try {
      await connectDB();
      info.mongooseReadyState = mongoose.connection.readyState;
      const db = mongoose.connection.db!;
      const count = await db.collection("routines").countDocuments();
      info.routinesInDB = count;
      info.dbName = db.databaseName;
      info.status = "OK";
    } catch (err: any) {
      info.status = "ERROR";
      info.error = err.message;
    }
  } else {
    info.status = "USING_MEMORY_DB - no MongoDB connection";
  }

  return NextResponse.json(info);
}
