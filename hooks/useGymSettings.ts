"use client";
import { useEffect, useState } from "react";

interface GymSettings {
  name: string;
  emoji: string;
}

const DEFAULTS: GymSettings = { name: "GymApp", emoji: "🏋️" };

export function useGymSettings() {
  const [settings, setSettings] = useState<GymSettings>(DEFAULTS);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.name || data.emoji) {
          setSettings({ name: data.name ?? DEFAULTS.name, emoji: data.emoji ?? DEFAULTS.emoji });
        }
      })
      .catch(() => {});
  }, []);

  return settings;
}
