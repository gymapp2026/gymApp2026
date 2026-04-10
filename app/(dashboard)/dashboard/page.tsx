import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Routine from "@/models/Routine";
import Claudio from "@/components/claudio/Claudio";
import DashboardHome from "@/components/dashboard/DashboardHome";

export default async function DashboardPage() {
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
    <div className="space-y-6">
      <Claudio />
      <DashboardHome initialRoutines={initialRoutines} />
    </div>
  );
}
