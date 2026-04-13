import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Claudio from "@/components/claudio/Claudio";
import DashboardHome from "@/components/dashboard/DashboardHome";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="space-y-6">
      <Claudio />
      <DashboardHome />
    </div>
  );
}
