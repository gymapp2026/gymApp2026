"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RoutineBuilder from "@/components/routines/RoutineBuilder";

export default function EditRoutinePage() {
  const { id } = useParams<{ id: string }>();
  const [routine, setRoutine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/routines")
      .then((r) => r.json())
      .then((data: any[]) => {
        const found = data.find((r) => r._id === id);
        if (found) {
          // Convertir exerciseId poblado a string ID para RoutineBuilder
          const normalizedDays = found.days.map((day: any) => ({
            day: day.day,
            exercises: day.exercises.map((ex: any) => ({
              exerciseId: typeof ex.exerciseId === "object" ? ex.exerciseId._id : ex.exerciseId,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.rest,
              notes: ex.notes || "",
            })),
          }));
          setRoutine({ ...found, days: normalizedDays });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-zinc-900 animate-pulse" />)}
    </div>
  );

  if (!routine) return (
    <p className="text-zinc-500 text-sm text-center py-8">Rutina no encontrada.</p>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-zinc-50">Editar rutina</h1>
      <RoutineBuilder
        routineId={id}
        initialName={routine.name}
        initialDescription={routine.description || ""}
        initialDays={routine.days}
      />
    </div>
  );
}
