"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Play, Dumbbell, Plus, Pencil, Trash2, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { IExercise } from "@/types";

function toYouTubeEmbed(url: string): string {
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const shorts = url.match(/youtube\.com\/shorts\/([^?&]+)/);
  if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;
  const watch = url.match(/[?&]v=([^&]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  return url;
}

const CATEGORIES = ["Todos", "Pecho", "Espalda", "Piernas", "Hombros", "Brazos", "Core", "Cardio"];
const EXERCISE_CATEGORIES = ["Pecho", "Espalda", "Piernas", "Hombros", "Brazos", "Core", "Cardio"];
const DIFFICULTY_COLORS = {
  beginner: "bg-[#0dcf0d]/10 text-[#0dcf0d] border-[#0dcf0d]/20",
  intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};
const DIFFICULTY_LABELS = { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado" };

const emptyForm = { name: "", category: "Pecho", difficulty: "beginner", muscleGroup: "", description: "", videoUrl: "", gifUrl: "" };

export default function ExerciseList() {
  const { data: session, status } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin" || (session?.user as any)?.role === "superadmin";

  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [filtered, setFiltered] = useState<IExercise[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [selected, setSelected] = useState<IExercise | null>(null);
  const [loading, setLoading] = useState(true);

  // Video edit state
  const [editingVideo, setEditingVideo] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [savingVideo, setSavingVideo] = useState(false);

  // Exercise form state
  const [showForm, setShowForm] = useState(false);
  const [editingEx, setEditingEx] = useState<IExercise | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [savingForm, setSavingForm] = useState(false);

  const fetchExercises = useCallback(() => {
    setLoading(true);
    fetch("/api/exercises")
      .then((r) => r.json())
      .then((data) => { setExercises(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { if (status === "authenticated") fetchExercises(); }, [status, fetchExercises]);
  useEffect(() => {
    const onFocus = () => { if (status === "authenticated") fetchExercises(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [status, fetchExercises]);

  useEffect(() => {
    let result = exercises;
    if (category !== "Todos") result = result.filter((e) => e.category === category);
    if (search) result = result.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [search, category, exercises]);

  const openNew = () => { setEditingEx(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (ex: IExercise, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEx(ex);
    setForm({ name: ex.name, category: ex.category, difficulty: ex.difficulty, muscleGroup: ex.muscleGroup?.join(", ") || "", description: ex.description || "", videoUrl: ex.videoUrl || "", gifUrl: ex.gifUrl || "" });
    setShowForm(true);
  };

  const saveForm = async () => {
    if (!form.name.trim() || !form.description.trim()) return toast.error("Nombre y descripción son obligatorios");
    setSavingForm(true);
    try {
      const payload = { ...form, muscleGroup: form.muscleGroup.split(",").map((s) => s.trim()).filter(Boolean) };
      const url = editingEx ? `/api/exercises/${editingEx._id}` : "/api/exercises";
      const method = editingEx ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      toast.success(editingEx ? "Ejercicio actualizado" : "Ejercicio creado");
      setShowForm(false);
      fetchExercises();
      if (selected && editingEx?._id === selected._id) setSelected(null);
    } catch {
      toast.error("Error al guardar el ejercicio");
    } finally {
      setSavingForm(false);
    }
  };

  const deleteEx = async (ex: IExercise, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`¿Eliminar "${ex.name}"?`)) return;
    try {
      await fetch(`/api/exercises/${ex._id}`, { method: "DELETE" });
      toast.success("Ejercicio eliminado");
      fetchExercises();
      if (selected?._id === ex._id) setSelected(null);
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const saveVideoUrl = async () => {
    if (!selected || !newVideoUrl.trim()) return;
    setSavingVideo(true);
    try {
      const res = await fetch(`/api/exercises/${selected._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: newVideoUrl.trim() }),
      });
      if (!res.ok) throw new Error();
      toast.success("Video guardado");
      const updated = { ...selected, videoUrl: newVideoUrl.trim() };
      setSelected(updated);
      setExercises((prev) => prev.map((e) => e._id === selected._id ? updated : e));
      setNewVideoUrl("");
      setEditingVideo(false);
    } catch {
      toast.error("Error al guardar el video");
    } finally {
      setSavingVideo(false);
    }
  };

  const openSelected = (ex: IExercise) => { setSelected(ex); setEditingVideo(false); setNewVideoUrl(""); };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Buscar ejercicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-500"
          />
        </div>
        {isAdmin && (
          <Button size="sm" onClick={openNew} className="bg-[#0dcf0d] hover:bg-[#0ab80a] text-zinc-950 font-semibold rounded-xl flex-shrink-0">
            <Plus size={14} className="mr-1" /> Nuevo
          </Button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${category === cat ? "bg-[#0dcf0d] text-zinc-950" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3, 4].map((i) => <div key={i} className="h-20 rounded-xl bg-zinc-900 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <Dumbbell size={40} className="mx-auto mb-3 opacity-30" />
          <p>No se encontraron ejercicios</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ex) => (
            <Card key={ex._id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer" onClick={() => openSelected(ex)}>
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-100 truncate">{ex.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500">{ex.category}</span>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${DIFFICULTY_COLORS[ex.difficulty]}`}>
                      {DIFFICULTY_LABELS[ex.difficulty]}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {ex.videoUrl && <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center"><Play size={14} className="text-[#0dcf0d]" /></div>}
                  {isAdmin && (
                    <>
                      <button onClick={(e) => openEdit(ex, e)} className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors">
                        <Pencil size={13} className="text-zinc-400" />
                      </button>
                      <button onClick={(e) => deleteEx(ex, e)} className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                        <Trash2 size={13} className="text-red-400" />
                      </button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal detalle ejercicio */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-zinc-50">{selected.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="border-zinc-700 text-zinc-400">{selected.category}</Badge>
                <Badge variant="outline" className={DIFFICULTY_COLORS[selected.difficulty]}>{DIFFICULTY_LABELS[selected.difficulty]}</Badge>
                {selected.muscleGroup?.map((m) => <Badge key={m} variant="outline" className="border-zinc-700 text-zinc-400 text-xs">{m}</Badge>)}
              </div>

              {selected.gifUrl && <img src={selected.gifUrl} alt={selected.name} className="w-full rounded-xl" />}

              {selected.videoUrl && !selected.gifUrl && (
                <div className="space-y-2">
                  <div className="aspect-video rounded-xl overflow-hidden bg-zinc-800">
                    <iframe src={toYouTubeEmbed(selected.videoUrl)} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                  {!editingVideo && (
                    <button onClick={() => { setNewVideoUrl(selected.videoUrl || ""); setEditingVideo(true); }} className="text-xs text-zinc-500 hover:text-[#0dcf0d] flex items-center gap-1 transition-colors">
                      <LinkIcon size={11} /> Editar video
                    </button>
                  )}
                  {editingVideo && (
                    <div className="flex gap-2">
                      <Input placeholder="Nuevo link de YouTube..." value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} className="bg-zinc-700 border-zinc-600 text-zinc-100 text-sm h-9" />
                      <Button size="sm" onClick={saveVideoUrl} disabled={savingVideo || !newVideoUrl.trim()} className="bg-[#0dcf0d] hover:bg-[#0ab80a] text-zinc-950 h-9 px-3 flex-shrink-0">{savingVideo ? "..." : "Guardar"}</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingVideo(false)} className="h-9 px-3 flex-shrink-0 text-zinc-400">Cancelar</Button>
                    </div>
                  )}
                </div>
              )}

              {!selected.gifUrl && !selected.videoUrl && (
                <div className="flex flex-col items-center justify-center py-4 rounded-xl bg-zinc-800/50 gap-3">
                  <Play size={28} className="text-zinc-600" />
                  <p className="text-sm text-zinc-500">Sin video todavía</p>
                  <div className="w-full space-y-2 px-2">
                    <p className="text-xs text-zinc-400 text-center">Pegá un link de YouTube</p>
                    <div className="flex gap-2">
                      <Input placeholder="https://youtube.com/watch?v=..." value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} className="bg-zinc-700 border-zinc-600 text-zinc-100 text-sm h-9" />
                      <Button size="sm" onClick={saveVideoUrl} disabled={savingVideo || !newVideoUrl.trim()} className="bg-[#0dcf0d] hover:bg-[#0ab80a] text-zinc-950 h-9 px-3 flex-shrink-0">
                        <LinkIcon size={13} className="mr-1" />{savingVideo ? "..." : "Agregar"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-zinc-400 leading-relaxed">{selected.description}</p>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Modal crear/editar ejercicio */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-zinc-50">{editingEx ? "Editar ejercicio" : "Nuevo ejercicio"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-zinc-300 text-sm">Nombre</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Press de banca" className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-600" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-300 text-sm">Categoría</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v ?? "Pecho" })}>
                  <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {EXERCISE_CATEGORIES.map((c) => <SelectItem key={c} value={c} className="text-zinc-200">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-zinc-300 text-sm">Dificultad</Label>
                <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v ?? "beginner" })}>
                  <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="beginner" className="text-zinc-200">Principiante</SelectItem>
                    <SelectItem value="intermediate" className="text-zinc-200">Intermedio</SelectItem>
                    <SelectItem value="advanced" className="text-zinc-200">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-zinc-300 text-sm">Músculos (separados por coma)</Label>
              <Input value={form.muscleGroup} onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })} placeholder="Ej: Pectoral, Tríceps" className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-600" />
            </div>
            <div>
              <Label className="text-zinc-300 text-sm">Descripción</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Cómo se hace el ejercicio..." rows={3} className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 resize-none" />
            </div>
            <div>
              <Label className="text-zinc-300 text-sm">Video de YouTube (URL)</Label>
              <Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-600" />
            </div>
            <div>
              <Label className="text-zinc-300 text-sm">GIF (URL opcional)</Label>
              <Input value={form.gifUrl} onChange={(e) => setForm({ ...form, gifUrl: e.target.value })} placeholder="https://..." className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-600" />
            </div>
            <Button onClick={saveForm} disabled={savingForm} className="w-full h-11 bg-[#0dcf0d] hover:bg-[#0ab80a] text-zinc-950 font-bold rounded-xl">
              {savingForm ? "Guardando..." : editingEx ? "Guardar cambios" : "Crear ejercicio"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
