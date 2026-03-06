"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { IExercise } from "@/types";

const CATEGORIES = ["Pecho", "Espalda", "Piernas", "Hombros", "Brazos", "Core", "Cardio"];
const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const DIFFICULTY_LABELS: Record<string, string> = { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado" };

interface FormState {
  name: string;
  category: string;
  muscleGroup: string;
  description: string;
  videoUrl: string;
  gifUrl: string;
  difficulty: string;
}

const emptyForm: FormState = { name: "", category: "Pecho", muscleGroup: "", description: "", videoUrl: "", gifUrl: "", difficulty: "beginner" };

export default function ExerciseManager() {
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IExercise | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchExercises = () => {
    fetch("/api/exercises").then((r) => r.json()).then((data) => {
      setExercises(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchExercises(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (ex: IExercise) => {
    setEditing(ex);
    setForm({
      name: ex.name,
      category: ex.category,
      muscleGroup: ex.muscleGroup?.join(", ") || "",
      description: ex.description,
      videoUrl: ex.videoUrl || "",
      gifUrl: ex.gifUrl || "",
      difficulty: ex.difficulty,
    });
    setShowForm(true);
  };

  const deleteExercise = async (id: string) => {
    if (!confirm("¿Eliminar este ejercicio?")) return;
    const res = await fetch(`/api/exercises/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Ejercicio eliminado"); fetchExercises(); }
    else toast.error("Error al eliminar");
  };

  const saveExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, muscleGroup: form.muscleGroup.split(",").map((s) => s.trim()).filter(Boolean) };
    try {
      const url = editing ? `/api/exercises/${editing._id}` : "/api/exercises";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error);
      toast.success(editing ? "Ejercicio actualizado" : "Ejercicio creado");
      setShowForm(false);
      fetchExercises();
    } catch { toast.error("Error de conexión"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <Button onClick={openCreate} size="sm" className="bg-green-500 hover:bg-green-600 text-zinc-950 font-semibold rounded-xl">
        <Plus size={14} className="mr-1" /> Nuevo ejercicio
      </Button>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-zinc-900 animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {exercises.map((ex) => (
            <Card key={ex._id} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-100 truncate">{ex.name}</p>
                  <div className="flex gap-1.5 mt-1">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-zinc-700 text-zinc-400">{ex.category}</Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-zinc-700 text-zinc-400">{DIFFICULTY_LABELS[ex.difficulty]}</Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800" onClick={() => openEdit(ex)}>
                    <Pencil size={13} />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => deleteExercise(ex._id)}>
                    <Trash2 size={13} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-zinc-50">{editing ? "Editar ejercicio" : "Nuevo ejercicio"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveExercise} className="space-y-3">
            <div>
              <Label className="text-zinc-300 text-sm">Nombre</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 h-10" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-300 text-sm">Categoría</Label>
                <Select value={form.category} onValueChange={(v) => v && setForm({ ...form, category: v })}>
                  <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="text-zinc-200">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-zinc-300 text-sm">Dificultad</Label>
                <Select value={form.difficulty} onValueChange={(v) => v && setForm({ ...form, difficulty: v })}>
                  <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {DIFFICULTIES.map((d) => <SelectItem key={d} value={d} className="text-zinc-200">{DIFFICULTY_LABELS[d]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-zinc-300 text-sm">Músculos (separados por coma)</Label>
              <Input value={form.muscleGroup} onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })}
                placeholder="Ej: Pectoral mayor, Tríceps" className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 h-10 placeholder:text-zinc-600" />
            </div>
            <div>
              <Label className="text-zinc-300 text-sm">Descripción</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required
                rows={3} className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 resize-none" />
            </div>
            <div>
              <Label className="text-zinc-300 text-sm">URL de Video (YouTube)</Label>
              <Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..." className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 h-10 placeholder:text-zinc-600" />
            </div>
            <div>
              <Label className="text-zinc-300 text-sm">URL de GIF</Label>
              <Input value={form.gifUrl} onChange={(e) => setForm({ ...form, gifUrl: e.target.value })}
                placeholder="https://..." className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 h-10 placeholder:text-zinc-600" />
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-green-500 hover:bg-green-600 text-zinc-950 font-bold rounded-xl">
              {saving ? "Guardando..." : (editing ? "Actualizar" : "Crear ejercicio")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
