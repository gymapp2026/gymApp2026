import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Exercise from "@/models/Exercise";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.name = { $regex: search, $options: "i" };

    const exercises = await Exercise.find(query).sort({ name: 1 });
    return NextResponse.json(exercises);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || (role !== "admin" && role !== "superadmin")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    const exercise = await Exercise.create(data);
    return NextResponse.json(exercise, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
