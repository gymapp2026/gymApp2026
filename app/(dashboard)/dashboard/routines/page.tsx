import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Routine from "@/models/Routine";
import RoutineList from "@/components/routines/RoutineList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function RoutinesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  let initialRoutines: any[] = [];
  try {
    await connectDB();
    const routines = await Routine.find({ userId: (session.user as any).id })
      .populate("days.exercises.exerciseId")
      .sort({ createdAt: -1 });
    initialRoutines = JSON.parse(JSON.stringify(routines));
  } catch {}

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-zinc-50">Mis rutinas</h1>
        <Button asChild size="sm" className="bg-[#0dcf0d] hover:bg-[#0ab80a] text-zinc-950 font-semibold rounded-xl">
          <Link href="/dashboard/routines/new">
            <Plus size={16} className="mr-1" /> Nueva
          </Link>
        </Button>
      </div>
      <RoutineList initialRoutines={initialRoutines} />
    </div>
  );
}
