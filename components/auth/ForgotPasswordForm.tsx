"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-3">🔑</div>
        <h1 className="text-2xl font-bold text-zinc-50">Recuperar contraseña</h1>
        <p className="text-zinc-500 text-sm mt-1">Te enviamos un link a tu email</p>
      </div>

      {sent ? (
        <div className="text-center space-y-4">
          <div className="text-4xl">📧</div>
          <p className="text-zinc-300">Si el email existe en nuestra base, recibirás un link para resetear tu contraseña.</p>
          <Link href="/login" className="text-[#0dcf0d] text-sm flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> Volver al login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-zinc-300 text-sm">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="mt-1 bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 h-12"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#0dcf0d] hover:bg-[#0ab80a] text-zinc-950 font-bold rounded-xl"
          >
            {loading ? "Enviando..." : "Enviar link"}
          </Button>
          <Link href="/login" className="text-zinc-500 text-sm flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> Volver al login
          </Link>
        </form>
      )}
    </motion.div>
  );
}
