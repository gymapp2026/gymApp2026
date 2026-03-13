import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, ClipboardList, Play, Shield, Zap, Crown } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover border-2 border-[#0dcf0d]/40 flex-shrink-0" />
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-50">
              <Link href="/login">Ingresar</Link>
            </Button>
            <Button asChild size="sm" className="bg-[#0dcf0d] hover:bg-[#0ab80a] text-zinc-950 font-semibold rounded-lg">
              <Link href="/register">Empezar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-16 pb-12 max-w-5xl mx-auto text-center">
        <Badge variant="outline" className="border-[#0dcf0d]/30 text-[#0dcf0d] mb-4 text-xs">
          Tu gym en el bolsillo 📱
        </Badge>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Entrená más inteligente,{" "}
          <span className="text-[#0dcf0d]">no más fuerte</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8">
          Armá tus rutinas, explorá ejercicios con videos, y seguí tu progreso con la ayuda de Claudio, tu asistente fitness personal.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="h-12 bg-[#0dcf0d] hover:bg-[#0ab80a] text-zinc-950 font-bold rounded-xl px-8">
            <Link href="/register">Empezar gratis</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-xl px-8">
            <Link href="/login">Ya tengo cuenta</Link>
          </Button>
        </div>
      </section>

      {/* Claudio preview */}
      <section className="px-4 pb-12 max-w-sm mx-auto">
        <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <img src="/logo.jpg" alt="Logo" className="w-16 h-16 rounded-full object-cover border-2 border-[#0dcf0d]/40 flex-shrink-0" />
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Claudio dice</p>
            <p className="font-bold text-zinc-50">Hola, campeón!</p>
            <p className="text-sm text-zinc-400">Dale, hoy toca entrenar 💪</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Todo lo que necesitás</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: ClipboardList, title: "Armá tus rutinas", desc: "Creá rutinas personalizadas por día con los ejercicios que quieras.", color: "text-[#0dcf0d]", bg: "bg-[#0dcf0d]/10" },
            { icon: Dumbbell, title: "Biblioteca de ejercicios", desc: "Explorá ejercicios con videos y GIFs para aprender la técnica correcta.", color: "text-blue-400", bg: "bg-blue-500/10" },
            { icon: Play, title: "Videos explicativos", desc: "Cada ejercicio tiene video o GIF para que no haya dudas de cómo hacerlo.", color: "text-purple-400", bg: "bg-purple-500/10" },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-1">{title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planes */}
      <section className="px-4 pb-20 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">Planes</h2>
        <p className="text-zinc-500 text-center text-sm mb-8">Elegí el plan que mejor se adapta a vos</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: null, name: "Free", price: "Gratis", features: ["Hasta 2 rutinas", "Ejercicios básicos", "Acceso a Claudio"], cta: "Empezar gratis", href: "/register", highlight: false },
            { icon: Zap, name: "Basic", price: "$5.000/mes", features: ["Rutinas ilimitadas", "Todos los ejercicios", "Videos HD", "Seguimiento de progreso"], cta: "Elegir Basic", href: "/register", highlight: true },
            { icon: Crown, name: "Pro", price: "$9.000/mes", features: ["Todo de Basic", "Planes de nutrición", "Soporte prioritario", "Rutinas de expertos"], cta: "Elegir Pro", href: "/register", highlight: false },
          ].map(({ icon: Icon, name, price, features, cta, href, highlight }) => (
            <div key={name} className={`relative bg-zinc-900 border rounded-2xl p-5 ${highlight ? "border-[#0dcf0d]/50" : "border-zinc-800"}`}>
              {highlight && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0dcf0d] text-zinc-950 text-xs font-bold">Más popular</Badge>}
              <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon size={16} className="text-[#0dcf0d]" />}
                <h3 className="font-bold text-zinc-100">{name}</h3>
              </div>
              <p className="text-2xl font-extrabold text-zinc-50 mb-4">{price}</p>
              <ul className="space-y-2 mb-5">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="text-[#0dcf0d]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className={`w-full rounded-xl ${highlight ? "bg-[#0dcf0d] hover:bg-[#0ab80a] text-zinc-950 font-bold" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"}`}>
                <Link href={href}>{cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        <p>© 2025 FullFutbol · Hecho con 💪 por Claudio</p>
      </footer>
    </div>
  );
}
