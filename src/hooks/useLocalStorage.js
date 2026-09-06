import { useEffect, useState } from "react";

/*
  A drop-in replacement for useState that also persists the value to
  localStorage under `key`. Reads happen once on mount; writes happen
  automatically any time the value changes, which is what lets the
  StreamList survive a page refresh instead of resetting to empty.
*/
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: couldn't read "${key}", falling back to default.`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`useLocalStorage: couldn't save "${key}".`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
