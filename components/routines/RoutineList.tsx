"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp, Plus, Dumbbell } from "lucide-react";
import Link from "next/link";
import { IRoutine } from "@/types";
import { toast } from "sonner";

export default function RoutineList() {
  const [routines, setRoutines] = useState<IRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchRoutines = () => {
    fetch("/api/routines")
      .then((r) => r.json())
      .then((data) => { setRoutines(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchRoutines(); }, []);

  const deleteRoutine = async (id: string) => {
    if (!confirm("¿Eliminar esta rutina?")) return;
    await fetch(`/api/routines/${id}`, { method: "DELETE" });
    toast.success("Rutina eliminada");
    fetchRoutines();
  };

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-zinc-900 animate-pulse" />)}
    </div>
  );

  if (routines.length === 0) return (
    <Card className="bg-zinc-900 border-zinc-800 border-dashed">
      <CardContent className="p-8 text-center">
        <Dumbbell size={40} className="mx-auto mb-3 text-zinc-700" />
        <p className="text-zinc-500 text-sm mb-4">No tenés rutinas todavía.</p>
        <Button asChild size="sm" className="bg-green-500 hover:bg-green-600 text-zinc-950">
          <Link href="/dashboard/routines/new"><Plus size={14} className="mr-1" /> Crear rutina</Link>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-3">
      {routines.map((routine) => (
        <Card key={routine._id} className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-0">
            <button
              className="w-full p-4 flex items-center justify-between text-left"
              onClick={() => setExpanded(expanded === routine._id ? null : routine._id)}
            >
              <div>
                <p className="font-medium text-zinc-100">{routine.name}</p>
                <p className="text-xs text-zinc-500">{routine.days.length} días · {routine.days.reduce((a, d) => a + d.exercises.length, 0)} ejercicios</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={(e) => { e.stopPropagation(); deleteRoutine(routine._id); }}
                >
                  <Trash2 size={14} />
                </Button>
                {expanded === routine._id ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
              </div>
            </button>

            {expanded === routine._id && (
              <div className="border-t border-zinc-800 p-4 space-y-3">
                {routine.description && <p className="text-sm text-zinc-400">{routine.description}</p>}
                {routine.days.map((day, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">{day.day}</p>
                    <div className="space-y-1.5">
                      {day.exercises.map((ex, j) => (
                        <div key={j} className="flex items-center justify-between bg-zinc-800/50 rounded-lg px-3 py-2">
                          <span className="text-sm text-zinc-300">{(ex as any).exerciseId?.name || "Ejercicio"}</span>
                          <span className="text-xs text-zinc-500">{ex.sets}×{ex.reps}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
