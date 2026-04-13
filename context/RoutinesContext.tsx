"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { IRoutine } from "@/types";

interface RoutinesContextValue {
  routines: IRoutine[];
  loading: boolean;
  refresh: () => void;
}

const RoutinesContext = createContext<RoutinesContextValue>({
  routines: [],
  loading: true,
  refresh: () => {},
});

export function RoutinesProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [routines, setRoutines] = useState<IRoutine[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    // Reintenta hasta 8 veces con 1.5s entre intentos (cubre cold start de MongoDB y Vercel)
    for (let i = 0; i < 8; i++) {
      try {
        const r = await fetch("/api/routines");
        const data = await r.json();
        if (r.ok && Array.isArray(data)) {
          setRoutines(data);
          setLoading(false);
          return;
        }
        // 401 = sesión no lista aún, esperar y reintentar
        // 500 = MongoDB cold start, esperar y reintentar
      } catch {}
      await new Promise((res) => setTimeout(res, 1500));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      refresh();
    }
  }, [status, refresh]);

  return (
    <RoutinesContext.Provider value={{ routines, loading, refresh }}>
      {children}
    </RoutinesContext.Provider>
  );
}

export function useRoutines() {
  return useContext(RoutinesContext);
}
