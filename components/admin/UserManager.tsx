"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus, UserCog } from "lucide-react";
import { toast } from "sonner";
import { IUser } from "@/types";

const ROLE_COLORS: Record<string, string> = {
  superadmin: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  user: "bg-zinc-700 text-zinc-300 border-zinc-600",
};

interface FormState {
  name: string;
  email: string;
  password: string;
  role: string;
  plan: string;
}

export default function UserManager() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "", role: "user", plan: "free" });
  const [saving, setSaving] = useState(false);

  const fetchUsers = () => {
    fetch("/api/admin/users").then((r) => r.json()).then((data) => {
      setUsers(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (id: string) => {
    if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Usuario eliminado"); fetchUsers(); }
    else toast.error("Error al eliminar");
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error);
      toast.success("Usuario creado");
      setShowCreate(false);
      setForm({ name: "", email: "", password: "", role: "user", plan: "free" });
      fetchUsers();
    } catch { toast.error("Error de conexión"); }
    finally { setSaving(false); }
  };

  const fields: { label: string; field: keyof FormState; type: string; placeholder: string }[] = [
    { label: "Nombre", field: "name", type: "text", placeholder: "Nombre completo" },
    { label: "Email", field: "email", type: "email", placeholder: "email@ejemplo.com" },
    { label: "Contraseña", field: "password", type: "password", placeholder: "Mínimo 6 caracteres" },
  ];

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowCreate(true)} size="sm" className="bg-green-500 hover:bg-green-600 text-zinc-950 font-semibold rounded-xl">
        <Plus size={14} className="mr-1" /> Nuevo usuario
      </Button>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-zinc-900 animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user._id} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-100 truncate">{user.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  <div className="flex gap-1.5 mt-1">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${ROLE_COLORS[user.role]}`}>{user.role}</Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-zinc-700 text-zinc-400">{user.plan}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => deleteUser(user._id)}
                >
                  <Trash2 size={14} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-zinc-50 flex items-center gap-2"><UserCog size={18} /> Nuevo usuario</DialogTitle>
          </DialogHeader>
          <form onSubmit={createUser} className="space-y-3">
            {fields.map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <Label className="text-zinc-300 text-sm">{label}</Label>
                <Input
                  type={type}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  placeholder={placeholder}
                  required
                  className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 h-10"
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-300 text-sm">Rol</Label>
                <Select value={form.role} onValueChange={(v) => v && setForm({ ...form, role: v })}>
                  <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {["user", "admin", "superadmin"].map((r) => <SelectItem key={r} value={r} className="text-zinc-200">{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-zinc-300 text-sm">Plan</Label>
                <Select value={form.plan} onValueChange={(v) => v && setForm({ ...form, plan: v })}>
                  <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-50 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {["free", "basic", "pro"].map((p) => <SelectItem key={p} value={p} className="text-zinc-200">{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-green-500 hover:bg-green-600 text-zinc-950 font-bold rounded-xl">
              {saving ? "Creando..." : "Crear usuario"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
