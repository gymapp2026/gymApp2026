"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { toast } from "sonner";

export default function GymSettingsForm() {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setName(data.name ?? "GymApp");
        setEmoji(data.emoji ?? "🏋️");
      })
      .catch(() => {});
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, emoji }),
      });
      if (res.ok) toast.success("Configuración guardada");
      else toast.error("Error al guardar");
    } catch {
      toast.error("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={18} className="text-green-400" />
          <p className="font-semibold text-zinc-100">Configuración del Gym</p>
        </div>
        <form onSubmit={save} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-zinc-300 text-sm">Emoji del logo</Label>
              <Input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="🏋️"
                className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 h-10 text-lg"
                maxLength={4}
              />
            </div>
            <div>
              <Label className="text-zinc-300 text-sm">Nombre del gym</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="GymApp"
                required
                className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 h-10"
                maxLength={30}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <span>Vista previa:</span>
              <span className="text-base">{emoji}</span>
              <span className="font-bold text-zinc-200">{name}</span>
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={saving}
              className="ml-auto bg-green-500 hover:bg-green-600 text-zinc-950 font-semibold rounded-xl"
            >
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
