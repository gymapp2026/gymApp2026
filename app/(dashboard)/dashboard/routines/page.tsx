import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RoutineList from "@/components/routines/RoutineList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function RoutinesPage() {
  const session = await auth();
  if (!session) redirect("/login");

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
      <RoutineList />
    </div>
  );
}
