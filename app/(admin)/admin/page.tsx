import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Shield, Users, Dumbbell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "admin" && role !== "superadmin")) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield size={20} className="text-green-400" />
          <h1 className="text-xl font-bold text-zinc-50">Panel de administración</h1>
        </div>
        <p className="text-sm text-zinc-500">Gestioná el contenido de la plataforma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/exercises">
          <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Dumbbell size={24} className="text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-zinc-100">Ejercicios</p>
                <p className="text-xs text-zinc-500">Agregar, editar o eliminar ejercicios</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {role === "superadmin" && (
          <Link href="/admin/users">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Users size={24} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-100">Usuarios</p>
                  <p className="text-xs text-zinc-500">Crear, editar o eliminar usuarios</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
