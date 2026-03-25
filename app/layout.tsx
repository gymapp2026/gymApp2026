import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SessionWrapper from "@/components/layout/SessionWrapper";
import { auth } from "@/lib/auth";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FullFutbol - Tu entrenamiento, tu camino",
  description: "Armá tus rutinas, explorá ejercicios y alcanzá tus objetivos con la ayuda de Claudio.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="es" className="dark">
      <body className={`${geist.className} bg-zinc-950 text-zinc-50 antialiased`}>
        <SessionWrapper session={session}>
          {children}
          <Toaster richColors position="top-center" />
        </SessionWrapper>
      </body>
    </html>
  );
}
