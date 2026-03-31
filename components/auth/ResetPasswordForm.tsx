"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) return (
    <div className="text-center text-zinc-500">
      <p>Token inválido o expirado.</p>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Las contraseñas no coinciden");
    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error);
      toast.success("Contraseña actualizada!");
      router.push("/login");
    } catch {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-3">🔒</div>
        <h1 className="text-2xl font-bold text-zinc-50">Nueva contraseña</h1>
        <p className="text-zinc-500 text-sm mt-1">Elegí tu nueva contraseña</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-zinc-300 text-sm">Nueva contraseña</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres" required minLength={6}
            className="mt-1 bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 h-12" />
        </div>
        <div>
          <Label className="text-zinc-300 text-sm">Confirmar contraseña</Label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repetí la contraseña" required
            className="mt-1 bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 h-12" />
        </div>
        <Button type="submit" disabled={loading}
          className="w-full h-12 bg-[#0dcf0d] hover:bg-[#0ab80a] text-zinc-950 font-bold rounded-xl">
          {loading ? "Actualizando..." : "Actualizar contraseña"}
        </Button>
      </form>
    </motion.div>
  );
}
