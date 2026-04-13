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
  const [fetched, setFetched] = useState(false);

  const refresh = useCallback(() => {
    fetch("/api/routines")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRoutines(data);
        setLoading(false);
        setFetched(true);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fetchea una sola vez cuando la sesión está lista
  useEffect(() => {
    if (status === "authenticated" && !fetched) {
      refresh();
    }
  }, [status, fetched, refresh]);

  return (
    <RoutinesContext.Provider value={{ routines, loading, refresh }}>
      {children}
    </RoutinesContext.Provider>
  );
}

export function useRoutines() {
  return useContext(RoutinesContext);
}
