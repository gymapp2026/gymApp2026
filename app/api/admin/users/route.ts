import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || (role !== "admin" && role !== "superadmin")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    await connectDB();
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "superadmin") {
      return NextResponse.json({ error: "Solo el superadmin puede crear usuarios" }, { status: 401 });
    }
    await connectDB();
    const { name, email, password, role: newRole, plan } = await req.json();
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return NextResponse.json({ error: "Email ya registrado" }, { status: 409 });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed, role: newRole || "user", plan: plan || "free" });
    return NextResponse.json({ ...user.toObject(), password: undefined }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
