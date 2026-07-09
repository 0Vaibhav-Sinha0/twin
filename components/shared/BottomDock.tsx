"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { getStars } from "@/lib/stars";

const NAV_ITEMS = [
  { href: "/home",          icon: "✦",  label: "Home"          },
  { href: "/timeline",      icon: "🌿",  label: "Timeline"      },
  { href: "/letters",       icon: "✉",  label: "Letters"       },
  { href: "/chat",          icon: "💬",  label: "Chats"         },
  { href: "/garden",        icon: "🌸",  label: "Garden"        },
  { href: "/cake",          icon: "🎂",  label: "Cake"          },
  { href: "/games",         icon: "🎮",  label: "Games"         },
  { href: "/thoughts",      icon: "💭",  label: "Nicknames"      },
  { href: "/constellation", icon: "🌌",  label: "Stars"         },
];

export default function BottomDock() {
  const pathname = usePathname();
  const [stars, setStars] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    setStars(getStars());
    const handler = (e: Event) => {
      setStars((e as CustomEvent<number>).detail);
    };
    window.addEventListener("stars-updated", handler);
    return () => window.removeEventListener("stars-updated", handler);
  }, []);

  const updateFadeState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateFadeState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateFadeState, { passive: true });
    window.addEventListener("resize", updateFadeState);
    return () => {
      el.removeEventListener("scroll", updateFadeState);
      window.removeEventListener("resize", updateFadeState);
    };
  }, [updateFadeState]);

  // Auto-scroll active item into view on route change
  useEffect(() => {
    const timeout = setTimeout(() => {
      activeRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      updateFadeState();
    }, 100);
    return () => clearTimeout(timeout);
  }, [pathname, updateFadeState]);

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 left-1/2 z-40"
      style={{ transform: "translateX(-50%)", maxWidth: "95vw" }}
      aria-label="Main navigation"
    >
      <div className="relative">
        {/* Left fade + scroll hint arrow */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-0 bottom-0 z-10 flex items-center pointer-events-none rounded-l-2xl"
              style={{
                width: "36px",
                background: "linear-gradient(to right, var(--dock-bg) 20%, transparent)",
              }}
            >
              <motion.span
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ color: "var(--accent-primary)", fontSize: "12px", marginLeft: "2px", opacity: 0.7 }}
              >
                ‹
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right fade + scroll hint arrow */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-end pointer-events-none rounded-r-2xl"
              style={{
                width: "36px",
                background: "linear-gradient(to left, var(--dock-bg) 20%, transparent)",
              }}
            >
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ color: "var(--accent-primary)", fontSize: "12px", marginRight: "2px", opacity: 0.7 }}
              >
                ›
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          className="flex items-center gap-1 px-4 py-3 rounded-2xl"
          style={{
            background: "var(--dock-bg)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--dock-border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
            overflowX: "auto",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={isActive ? activeRef : undefined}
                className="dock-item relative flex flex-col items-center justify-center rounded-xl transition-all duration-200"
                style={{
                  width: "44px",
                  height: "44px",
                  flexShrink: 0,
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
                      backgroundColor: "var(--accent-primary)",
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
                flexShrink: 0,
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
      </div>
    </motion.nav>
  );
}
