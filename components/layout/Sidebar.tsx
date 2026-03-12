"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, ClipboardList, User, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useGymSettings } from "@/hooks/useGymSettings";

const userNav = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/dashboard/routines", label: "Mis Rutinas", icon: ClipboardList },
  { href: "/dashboard/exercises", label: "Ejercicios", icon: Dumbbell },
  { href: "/dashboard/profile", label: "Mi Perfil", icon: User },
];

const adminNav = [
  { href: "/admin", label: "Panel Admin", icon: Shield },
  { href: "/admin/exercises", label: "Gestionar Ejercicios", icon: Dumbbell },
];

const superAdminNav = [
  { href: "/admin/users", label: "Gestionar Usuarios", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const { name, emoji } = useGymSettings();

  const allNav = [
    ...userNav,
    ...(role === "admin" || role === "superadmin" ? adminNav : []),
    ...(role === "superadmin" ? superAdminNav : []),
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-zinc-900 border-r border-zinc-800 p-4 gap-1 fixed left-0 top-0">
      <div className="flex items-center gap-2 px-2 py-4 mb-4">
        <span className="text-2xl">{emoji}</span>
        <span className="font-bold text-lg text-zinc-50">{name}</span>
      </div>
      {allNav.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              isActive
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
