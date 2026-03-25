"use client";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";

const greetings = [
  "Dale, hoy toca entrenar 💪",
  "Tu cuerpo te lo va a agradecer 🔥",
  "Sin excusas, vamos a romperla 🚀",
  "Cada rep te acerca a tu meta 🎯",
  "Hoy es un buen día para sudar 💦",
  "No pares hasta que estés orgulloso 🏆",
  "Un día más, una versión mejor 🌟",
  "El único mal entrenamiento es el que no hiciste 💡",
  "Confía en el proceso 🔄",
  "Hoy duele, mañana se nota 💥",
  "La constancia vence al talento 💎",
  "Más peso, más fuerza, más vos 🦾",
];

export default function Claudio() {
  const { data: session } = useSession();
  const name = session?.user?.name?.split(" ")[0] || "campeón";
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
        className="flex-shrink-0"
        aria-label="Claudio el asistente"
      >
        <Image src="/logo.jpg" alt="Logo" width={56} height={56} className="rounded-full object-cover border-2 border-[#0dcf0d]/40" />
      </motion.div>
      <div>
        <p className="text-lg font-bold text-zinc-50">Hola, {name}!</p>
        <p className="text-sm text-zinc-400">{greeting}</p>
      </div>
    </motion.div>
  );
}
