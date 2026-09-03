import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = () => {
      try {
        const stored = window.localStorage.getItem(key);
        if (stored) setValue(JSON.parse(stored) as T);
      } catch {
        // Fall back to the supplied demo data when browser storage is unavailable.
      } finally {
        setHydrated(true);
      }
    };
    const frame = window.requestAnimationFrame(hydrate);
    return () => window.cancelAnimationFrame(frame);
  }, [key]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(key, JSON.stringify(value));
  }, [hydrated, key, value]);

  return [value, setValue] as const;
}
