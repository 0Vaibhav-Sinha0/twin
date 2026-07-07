"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <motion.button
      onClick={toggle}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        background: "var(--toggle-bg)",
        border: "1px solid var(--toggle-border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: isDark
          ? "0 0 16px rgba(58,169,255,0.1)"
          : "0 2px 12px rgba(196,124,90,0.15)",
        cursor: "pointer",
      }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ fontSize: "14px", lineHeight: 1 }}
      >
        {isDark ? "☀️" : "🌙"}
      </motion.span>
      <span
        className="font-display"
        style={{
          fontSize: "9px",
          letterSpacing: "0.15em",
          color: "var(--toggle-text)",
        }}
      >
        {isDark ? "LIGHT" : "DARK"}
      </span>
    </motion.button>
  );
}
