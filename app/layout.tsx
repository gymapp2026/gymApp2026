import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SessionWrapper from "@/components/layout/SessionWrapper";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GymApp - Tu entrenamiento, tu camino",
  description: "Armá tus rutinas, explorá ejercicios y alcanzá tus objetivos con la ayuda de Claudio.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${geist.className} bg-zinc-950 text-zinc-50 antialiased`}>
        <SessionWrapper>
          {children}
          <Toaster richColors position="top-center" />
        </SessionWrapper>
      </body>
    </html>
  );
}
