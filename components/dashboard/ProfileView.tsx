"use client";
import { useSession, signOut } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Crown, Zap, Star } from "lucide-react";

const PLAN_INFO = {
  free: { label: "Free", color: "text-zinc-400", icon: null, bg: "bg-zinc-800" },
  basic: { label: "Basic", color: "text-blue-400", icon: Zap, bg: "bg-blue-500/10" },
  pro: { label: "Pro", color: "text-yellow-400", icon: Crown, bg: "bg-yellow-500/10" },
};

const ROLE_LABELS = {
  user: "Usuario",
  admin: "Administrador",
  superadmin: "Super Admin",
};

export default function ProfileView() {
  const { data: session } = useSession();
  if (!session?.user) return null;

  const user = session.user as any;
  const initials = user.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const plan = PLAN_INFO[user.plan as keyof typeof PLAN_INFO] || PLAN_INFO.free;
  const PlanIcon = plan.icon;

  return (
    <div className="space-y-4">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-5 flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-green-500/20 text-green-400 text-xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-bold text-zinc-50">{user.name}</p>
            <p className="text-sm text-zinc-500">{user.email}</p>
            <Badge variant="outline" className="mt-1 border-zinc-700 text-zinc-400 text-xs">
              {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || "Usuario"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-5">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-3">Plan actual</p>
          <div className={`flex items-center gap-3 p-3 rounded-xl ${plan.bg}`}>
            {PlanIcon && <PlanIcon size={20} className={plan.color} />}
            <div>
              <p className={`font-bold ${plan.color}`}>{plan.label}</p>
              <p className="text-xs text-zinc-500">
                {user.plan === "free" && "Acceso básico a la plataforma"}
                {user.plan === "basic" && "Rutinas ilimitadas + ejercicios completos"}
                {user.plan === "pro" && "Todo incluido + seguimiento avanzado"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full h-12 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut size={16} className="mr-2" /> Cerrar sesión
      </Button>
    </div>
  );
}
