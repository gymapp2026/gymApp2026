"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
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
  const [routines, setRoutines] = useState<IRoutine[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    for (let i = 0; i < 10; i++) {
      try {
        const r = await fetch("/api/routines");
        if (r.status === 401) {
          // Sesión todavía no lista en el servidor, esperar y reintentar
          await new Promise((res) => setTimeout(res, 800));
          continue;
        }
        const data = await r.json();
        if (r.ok && Array.isArray(data)) {
          setRoutines(data);
          setLoading(false);
          return;
        }
        // 500 u otro error — esperar y reintentar
        await new Promise((res) => setTimeout(res, 1000));
      } catch {
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
    setLoading(false);
  }, []);

  // Fetchea inmediatamente al montar — la cookie ya está en el browser
  // No esperar useSession: eso introduce el delay que causa el bug
  useEffect(() => {
    refresh();
  }, []); // eslint-disable-line

  return (
    <RoutinesContext.Provider value={{ routines, loading, refresh }}>
      {children}
    </RoutinesContext.Provider>
  );
}

export function useRoutines() {
  return useContext(RoutinesContext);
}
