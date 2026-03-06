import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserManager from "@/components/admin/UserManager";

export default async function AdminUsersPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || role !== "superadmin") redirect("/dashboard");

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-50 mb-4">Gestión de usuarios</h1>
      <UserManager />
    </div>
  );
}
