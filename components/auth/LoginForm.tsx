"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      toast.error("Email o contraseña incorrectos");
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <Image src="/logo.jpg" alt="Logo" width={80} height={80} className="rounded-full object-cover border-2 border-[#0dcf0d]/40" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-50">Bienvenido de vuelta</h1>
        <p className="text-zinc-500 text-sm mt-1">Ingresá a tu cuenta</p>
      </div>

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
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-zinc-300 text-sm">Contraseña</Label>
            <Link href="/forgot-password" className="text-xs text-[#0dcf0d] hover:text-[#0ab80a]">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="mt-1 bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 h-12"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-[#0dcf0d] hover:bg-[#0ab80a] text-zinc-950 font-bold rounded-xl text-base"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        ¿No tenés cuenta?{" "}
        <Link href="/register" className="text-[#0dcf0d] hover:text-[#0ab80a] font-medium">
          Registrate gratis
        </Link>
      </p>
    </motion.div>
  );
}
