"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRoutines } from "@/context/RoutinesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { IExercise } from "@/types";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

interface RoutineExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  rest: number;
  notes: string;
}

interface RoutineDay {
  day: string;
  exercises: RoutineExercise[];
}

interface Props {
  routineId?: string;
  initialName?: string;
  initialDescription?: string;
  initialDays?: RoutineDay[];
}

export default function RoutineBuilder({ routineId, initialName = "", initialDescription = "", initialDays }: Props) {
  const router = useRouter();
  const { refresh } = useRoutines();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [days, setDays] = useState<RoutineDay[]>(initialDays ?? [{ day: "Lunes", exercises: [] }]);
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [saving, setSaving] = useState(false);
  const isEditing = !!routineId;

  useEffect(() => {
    fetch("/api/exercises").then((r) => r.json()).then((data) => setExercises(Array.isArray(data) ? data : []));
  }, []);

  const addDay = () => setDays([...days, { day: "Lunes", exercises: [] }]);
  const removeDay = (i: number) => setDays(days.filter((_, idx) => idx !== i));
  const updateDayField = (i: number, value: string | null) =>
    setDays(days.map((d, idx) => idx === i ? { ...d, day: value ?? d.day } : d));

  const addExercise = (dayIdx: number) =>
    setDays(days.map((d, i) => i === dayIdx
      ? { ...d, exercises: [...d.exercises, { exerciseId: "", sets: 3, reps: 10, rest: 60, notes: "" }] }
      : d));

  const removeExercise = (dayIdx: number, exIdx: number) =>
    setDays(days.map((d, i) => i === dayIdx
      ? { ...d, exercises: d.exercises.filter((_, j) => j !== exIdx) }
      : d));

  const updateExerciseField = (dayIdx: number, exIdx: number, field: keyof RoutineExercise, value: string | number | null) =>
    setDays(days.map((d, i) => i === dayIdx
      ? { ...d, exercises: d.exercises.map((ex, j) => j === exIdx ? { ...ex, [field]: value } : ex) }
      : d));

  const save = async () => {
    if (!name.trim()) return toast.error("Poné un nombre a la rutina");
    setSaving(true);
    try {
      const url = isEditing ? `/api/routines/${routineId}` : "/api/routines";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, days }),
      });
      if (!res.ok) throw new Error();
      toast.success(isEditing ? "Rutina actualizada!" : "Rutina creada!");
      refresh();
      router.push("/dashboard/routines");
    } catch {
      toast.error("Error al guardar la rutina");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div>
          <Label className="text-zinc-300 text-sm">Nombre de la rutina</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Fuerza Upper/Lower"
            className="mt-1 bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600"
          />
        </div>
        <div>
          <Label className="text-zinc-300 text-sm">Descripción (opcional)</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción de tu rutina..."
            rows={2}
            className="mt-1 bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 resize-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {days.map((day, dayIdx) => (
          <Card key={dayIdx} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Select value={day.day} onValueChange={(v) => updateDayField(dayIdx, v)}>
                  <SelectTrigger className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {DAYS.map((d) => <SelectItem key={d} value={d} className="text-zinc-200">{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDay(dayIdx)}
                  className="w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  disabled={days.length === 1}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              {day.exercises.map((ex, exIdx) => (
                <div key={exIdx} className="bg-zinc-800/50 rounded-xl p-3 space-y-2">
                  <div className="flex gap-2">
                    <Select value={ex.exerciseId} onValueChange={(v) => updateExerciseField(dayIdx, exIdx, "exerciseId", v)}>
                      <SelectTrigger className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-50 text-sm h-9">
                        <SelectValue placeholder="Elegir ejercicio..." />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700 max-h-48">
                        {exercises.map((e) => (
                          <SelectItem key={e._id} value={e._id} className="text-zinc-200 text-sm">{e.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExercise(dayIdx, exIdx)}
                      className="w-8 h-8 text-red-400 hover:bg-red-500/10 flex-shrink-0"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(["sets", "reps", "rest"] as const).map((field) => (
                      <div key={field}>
                        <Label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                          {field === "sets" ? "Series" : field === "reps" ? "Reps" : "Descanso (s)"}
                        </Label>
                        <Input
                          type="number"
                          value={ex[field]}
                          onChange={(e) => updateExerciseField(dayIdx, exIdx, field, Number(e.target.value))}
                          className="mt-1 h-8 bg-zinc-800 border-zinc-700 text-zinc-50 text-sm text-center"
                          min={1}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => addExercise(dayIdx)}
                className="w-full border-dashed border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              >
                <Plus size={14} className="mr-1" /> Agregar ejercicio
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={addDay}
        className="w-full border-dashed border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
      >
        <Plus size={14} className="mr-1" /> Agregar día
      </Button>

      <Button
        onClick={save}
        disabled={saving}
        className="w-full h-12 bg-[#0dcf0d] hover:bg-[#0ab80a] text-zinc-950 font-bold rounded-xl text-base"
      >
        {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Guardar rutina"}
      </Button>
    </div>
  );
}
