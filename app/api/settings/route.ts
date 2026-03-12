import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import GymSettings from "@/models/GymSettings";

export async function GET() {
  await connectDB();
  const settings = await GymSettings.findOne({ slug: "default" });
  return NextResponse.json({
    name: settings?.name ?? "GymApp",
    emoji: settings?.emoji ?? "🏋️",
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user?.id || (role !== "admin" && role !== "superadmin")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const update: Record<string, string> = {};
  if (typeof body.name === "string" && body.name.trim()) update.name = body.name.trim();
  if (typeof body.emoji === "string" && body.emoji.trim()) update.emoji = body.emoji.trim();

  const settings = await GymSettings.findOneAndUpdate(
    { slug: "default" },
    update,
    { upsert: true, new: true }
  );

  return NextResponse.json({ name: settings.name, emoji: settings.emoji });
}
