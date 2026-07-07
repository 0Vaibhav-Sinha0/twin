"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getStars } from "@/lib/stars";

const NAV_ITEMS = [
  { href: "/home",          icon: "✦",  label: "Home"          },
  { href: "/timeline",      icon: "🌿",  label: "Timeline"      },
  { href: "/letters",       icon: "✉",  label: "Letters"       },
  { href: "/chat",          icon: "💬",  label: "Chats"         },
  { href: "/garden",        icon: "🌸",  label: "Garden"        },
  { href: "/cake",          icon: "🎂",  label: "Cake"          },
  { href: "/games",         icon: "🎮",  label: "Games"         },
  { href: "/thoughts",      icon: "💭",  label: "Thoughts"      },
  { href: "/constellation", icon: "🌌",  label: "Stars"         },
];

export default function BottomDock() {
  const pathname = usePathname();
  const [stars, setStars] = useState(0);

  useEffect(() => {
    setStars(getStars());
    const handler = (e: Event) => {
      setStars((e as CustomEvent<number>).detail);
    };
    window.addEventListener("stars-updated", handler);
    return () => window.removeEventListener("stars-updated", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 left-1/2 z-40"
      style={{ transform: "translateX(-50%)" }}
      aria-label="Main navigation"
    >
      <div
        className="flex items-center gap-1 px-4 py-3 rounded-2xl"
        style={{
          background: "var(--dock-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--dock-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
          overflowX: "auto",
          maxWidth: "95vw",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="dock-item relative flex flex-col items-center justify-center rounded-xl transition-all duration-200"
              style={{
                width: "44px",
                height: "44px",
                background: isActive ? "var(--dock-active)" : "transparent",
                boxShadow: isActive
                  ? "0 0 12px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.08)"
                  : "none",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                style={{
                  fontSize: "18px",
                  filter: isActive
                    ? "drop-shadow(0 0 6px var(--accent-primary))"
                    : "none",
                  opacity: isActive ? 1 : 0.55,
                  transition: "all 0.2s ease",
                  lineHeight: 1,
                }}
              >
                {item.icon}
              </span>
              {isActive && (
                <motion.div
                  layoutId="dock-active-dot"
                  className="absolute bottom-1.5 rounded-full"
                  style={{
                    width: "3px",
                    height: "3px",
                    backgroundColor: "#3aa9ff",
                    boxShadow: "0 0 4px #3aa9ff",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className="dock-label absolute font-display text-center"
                style={{
                  bottom: "calc(100% + 8px)",
                  fontSize: "9px",
                  letterSpacing: "0.12em",
                  color: "#e8f4ff",
                  whiteSpace: "nowrap",
                  background: "rgba(5,7,15,0.85)",
                  backdropFilter: "blur(8px)",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(58,169,255,0.15)",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Star counter */}
        {stars > 0 && (
          <div
            className="flex items-center gap-1 ml-1 px-2 py-1 rounded-full"
            style={{
              background: "rgba(251,191,36,0.12)",
              border: "1px solid rgba(251,191,36,0.25)",
            }}
          >
            <span style={{ fontSize: "12px" }}>⭐</span>
            <span
              className="font-display"
              style={{ fontSize: "11px", color: "#fbbf24", letterSpacing: "0.05em" }}
            >
              {stars}
            </span>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
