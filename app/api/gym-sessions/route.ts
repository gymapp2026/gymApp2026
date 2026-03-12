import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import GymSession from "@/models/GymSession";

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function todayDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await connectDB();
  const weekStart = startOfWeek(new Date());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const sessions = await GymSession.find({
    userId: session.user.id,
    date: { $gte: weekStart, $lt: weekEnd },
  });

  const todayStr = todayDate().toISOString().split("T")[0];
  const doneToday = sessions.some((s: any) => {
    const d = new Date(s.date);
    return d.toISOString().split("T")[0] === todayStr;
  });

  return NextResponse.json({ count: sessions.length, doneToday });
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await connectDB();
  const today = todayDate();

  try {
    const existing = await GymSession.findOne({ userId: session.user.id, date: today });
    if (existing) {
      return NextResponse.json({ message: "Ya marcaste hoy", doneToday: true });
    }
    await GymSession.create({ userId: session.user.id, date: today });
    return NextResponse.json({ message: "Día marcado", doneToday: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
