import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Routine from "@/models/Routine";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    await connectDB();
    const routines = await Routine.find({ userId: (session.user as any).id })
      .populate("days.exercises.exerciseId")
      .sort({ createdAt: -1 });

    return NextResponse.json(routines);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    await connectDB();
    const data = await req.json();
    const routine = await Routine.create({ ...data, userId: (session.user as any).id });
    return NextResponse.json(routine, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
