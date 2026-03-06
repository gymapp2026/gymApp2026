import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExerciseManager from "@/components/admin/ExerciseManager";

export default async function AdminExercisesPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "admin" && role !== "superadmin")) redirect("/dashboard");

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-50 mb-4">Gestión de ejercicios</h1>
      <ExerciseManager />
    </div>
  );
}
