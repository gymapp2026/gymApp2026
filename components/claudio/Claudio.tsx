"use client";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

const greetings = [
  "Dale, hoy toca entrenar 💪",
  "Tu cuerpo te lo va a agradecer 🔥",
  "Sin excusas, vamos a romperla 🚀",
  "Cada rep te acerca a tu meta 🎯",
  "Hoy es un buen día para sudar 💦",
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
        className="text-5xl select-none"
        aria-label="Claudio el asistente"
      >
        🏋️
      </motion.div>
      <div>
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Claudio dice</p>
        <p className="text-lg font-bold text-zinc-50">Hola, {name}!</p>
        <p className="text-sm text-zinc-400">{greeting}</p>
      </div>
    </motion.div>
  );
}
