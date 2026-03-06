import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder_key");

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    // Siempre retornar 200 para no revelar si el email existe
    if (!user) {
      return NextResponse.json({ message: "Si el email existe, recibirás un link de recuperación" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;
    const fromEmail = process.env.EMAIL_FROM || "noreply@gymapp.com";

    await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: "Recuperar contraseña - GymApp",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
          <h2>Recuperar contraseña</h2>
          <p>Hola ${user.name}, recibimos una solicitud para resetear tu contraseña.</p>
          <a href="${resetUrl}" style="background:#22c55e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0;">
            Resetear contraseña
          </a>
          <p>Este link expira en 1 hora. Si no solicitaste esto, ignorá este email.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Si el email existe, recibirás un link de recuperación" });
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
