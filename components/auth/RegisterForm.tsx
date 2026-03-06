"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Las contraseñas no coinciden");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Error al registrarse");
      toast.success("Cuenta creada! Ingresá ahora");
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
        <div className="text-5xl mb-3">💪</div>
        <h1 className="text-2xl font-bold text-zinc-50">Creá tu cuenta</h1>
        <p className="text-zinc-500 text-sm mt-1">Comenzá tu camino fitness hoy</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-zinc-300 text-sm">Nombre</Label>
          <Input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Tu nombre"
            required
            className="mt-1 bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 h-12"
          />
        </div>
        <div>
          <Label className="text-zinc-300 text-sm">Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="tu@email.com"
            required
            className="mt-1 bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 h-12"
          />
        </div>
        <div>
          <Label className="text-zinc-300 text-sm">Contraseña</Label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
            className="mt-1 bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 h-12"
          />
        </div>
        <div>
          <Label className="text-zinc-300 text-sm">Confirmar contraseña</Label>
          <Input
            type="password"
            value={form.confirm}
            onChange={(e) => update("confirm", e.target.value)}
            placeholder="Repetí tu contraseña"
            required
            className="mt-1 bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 h-12"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-green-500 hover:bg-green-600 text-zinc-950 font-bold rounded-xl text-base"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="text-green-400 hover:text-green-300 font-medium">
          Ingresá
        </Link>
      </p>
    </motion.div>
  );
}
