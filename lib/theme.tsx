"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  isDark: boolean;
  forceDark: () => void;
  releaseForce: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggle: () => {},
  isDark: true,
  forceDark: () => {},
  releaseForce: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const forcedRef = useRef(false);
  const savedThemeRef = useRef<Theme>("dark");

  // Apply theme to <html> data-theme attribute (unless force-locked)
  useEffect(() => {
    if (forcedRef.current) return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    if (forcedRef.current) return; // ignore toggles while force-locked
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  // Lock the page to dark mode regardless of the stored preference —
  // used by pages built as fixed night scenes (e.g. the birthday cake)
  // so a light-mode toggle elsewhere in the site can't bleed in and
  // break contrast on a page that was never designed to support it.
  const forceDark = useCallback(() => {
    savedThemeRef.current = theme;
    forcedRef.current = true;
    document.documentElement.setAttribute("data-theme", "dark");
  }, [theme]);

  const releaseForce = useCallback(() => {
    forcedRef.current = false;
    document.documentElement.setAttribute("data-theme", savedThemeRef.current);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark: theme === "dark", forceDark, releaseForce }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Convenience hook — call in any page component that must always be dark,
// regardless of the site-wide light/dark toggle state.
export function useForceDarkMode() {
  const { forceDark, releaseForce } = useTheme();
  useEffect(() => {
    forceDark();
    return () => releaseForce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
