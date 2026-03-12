"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, ChevronDown, ChevronUp, Plus, Dumbbell, Play, Check } from "lucide-react";
import Link from "next/link";
import { IRoutine } from "@/types";
import { toast } from "sonner";

export default function RoutineList() {
  const [routines, setRoutines] = useState<IRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [completedExs, setCompletedExs] = useState<Set<string>>(new Set());
  const [videoEx, setVideoEx] = useState<{ name: string; videoUrl?: string; gifUrl?: string; description?: string } | null>(null);

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

  const toggleEx = (key: string) => {
    setCompletedExs((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
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
    <>
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
                        {day.exercises.map((ex, j) => {
                          const key = `${routine._id}-${i}-${j}`;
                          const done = completedExs.has(key);
                          const exData = (ex as any).exerciseId;
                          const hasMedia = exData?.videoUrl || exData?.gifUrl;
                          return (
                            <div key={j} className={`flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${done ? "bg-green-500/10" : "bg-zinc-800/50"}`}>
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <button
                                  onClick={() => toggleEx(key)}
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${done ? "border-green-500 bg-green-500" : "border-zinc-600 hover:border-green-500"}`}
                                >
                                  {done && <Check size={10} className="text-zinc-950" strokeWidth={3} />}
                                </button>
                                <span className={`text-sm truncate ${done ? "text-zinc-500 line-through" : "text-zinc-300"}`}>
                                  {exData?.name || "Ejercicio"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs text-zinc-500">{ex.sets}×{ex.reps}</span>
                                {hasMedia && (
                                  <button
                                    onClick={() => setVideoEx({ name: exData.name, videoUrl: exData.videoUrl, gifUrl: exData.gifUrl, description: exData.description })}
                                    className="w-7 h-7 rounded-lg bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors"
                                  >
                                    <Play size={12} className="text-green-400" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!videoEx} onOpenChange={() => setVideoEx(null)}>
        {videoEx && (
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-zinc-50">{videoEx.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {videoEx.gifUrl && (
                <img src={videoEx.gifUrl} alt={videoEx.name} className="w-full rounded-xl" />
              )}
              {videoEx.videoUrl && !videoEx.gifUrl && (
                <div className="aspect-video rounded-xl overflow-hidden bg-zinc-800">
                  <iframe
                    src={videoEx.videoUrl.replace("watch?v=", "embed/")}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {videoEx.description && (
                <p className="text-sm text-zinc-400 leading-relaxed">{videoEx.description}</p>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
