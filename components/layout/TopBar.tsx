"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const initials = session?.user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 h-14 flex items-center px-4 md:pl-64">
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto md:max-w-full">
        <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
          <span className="text-xl">🏋️</span>
          <span className="font-bold text-sm text-zinc-50">GymApp</span>
        </Link>
        <div className="hidden md:block" />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="w-9 h-9 cursor-pointer">
              <AvatarFallback className="bg-green-500/20 text-green-400 text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/profile")}
              className="flex items-center gap-2 text-zinc-300 cursor-pointer"
            >
              <User size={14} /> Mi Perfil
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 text-red-400 cursor-pointer"
            >
              <LogOut size={14} /> Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
