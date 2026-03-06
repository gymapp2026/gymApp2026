"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Dumbbell, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";
import { IRoutine } from "@/types";

export default function DashboardHome() {
  const [routines, setRoutines] = useState<IRoutine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/routines")
      .then((r) => r.json())
      .then((data) => {
        setRoutines(Array.isArray(data) ? data.slice(0, 3) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      {/* Stats rápidas */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <ClipboardList size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-50">{routines.length}</p>
              <p className="text-xs text-zinc-500">Rutinas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Dumbbell size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-50">
                {routines.reduce((acc, r) => acc + r.days.length, 0)}
              </p>
              <p className="text-xs text-zinc-500">Días de entreno</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acceso rápido */}
      <div className="grid grid-cols-2 gap-3">
        <Button asChild className="h-14 bg-green-500 hover:bg-green-600 text-zinc-950 font-semibold rounded-xl">
          <Link href="/dashboard/routines/new">
            <Plus size={18} className="mr-1" /> Nueva rutina
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-14 border-zinc-700 hover:bg-zinc-800 rounded-xl">
          <Link href="/dashboard/exercises">
            <Dumbbell size={18} className="mr-1" /> Ver ejercicios
          </Link>
        </Button>
      </div>

      {/* Mis rutinas recientes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-zinc-200">Mis rutinas</h2>
          <Link href="/dashboard/routines" className="text-xs text-green-400 flex items-center gap-1">
            Ver todas <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : routines.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800 border-dashed">
            <CardContent className="p-6 text-center">
              <p className="text-zinc-500 text-sm">Todavía no tenés rutinas creadas.</p>
              <Button asChild size="sm" className="mt-3 bg-green-500 hover:bg-green-600 text-zinc-950">
                <Link href="/dashboard/routines/new">Crear mi primera rutina</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {routines.map((routine) => (
              <Link key={routine._id} href={`/dashboard/routines`}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-100">{routine.name}</p>
                      <p className="text-xs text-zinc-500">{routine.days.length} días</p>
                    </div>
                    <ChevronRight size={18} className="text-zinc-600" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
