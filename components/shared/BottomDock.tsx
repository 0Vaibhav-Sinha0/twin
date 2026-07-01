"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/home",     icon: "✦",  label: "Home"     },
  { href: "/gallery",  icon: "🖼",  label: "Gallery"  },
  { href: "/timeline", icon: "🌿",  label: "Timeline" },
  { href: "/letters",  icon: "✉",  label: "Letters"  },
  { href: "/chat",     icon: "💬",  label: "Chats"    },
  { href: "/garden",   icon: "🌸",  label: "Garden"   },
  { href: "/cake",     icon: "🎂",  label: "Cake"     },
  { href: "/games",    icon: "🎮",  label: "Games"    },
  { href: "/journal",  icon: "📖",  label: "Journal"  },
  { href: "/thoughts", icon: "💭",  label: "Thoughts" },
];

export default function BottomDock() {
  const pathname = usePathname();

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
          background: "rgba(5, 7, 15, 0.65)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(58, 169, 255, 0.12)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
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
                background: isActive
                  ? "rgba(58, 169, 255, 0.18)"
                  : "transparent",
                boxShadow: isActive
                  ? "0 0 12px rgba(58,169,255,0.25), inset 0 1px 0 rgba(255,255,255,0.08)"
                  : "none",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Icon */}
              <span
                style={{
                  fontSize: "18px",
                  filter: isActive
                    ? "drop-shadow(0 0 6px rgba(58,169,255,0.8))"
                    : "none",
                  opacity: isActive ? 1 : 0.55,
                  transition: "all 0.2s ease",
                  lineHeight: 1,
                }}
              >
                {item.icon}
              </span>

              {/* Active dot */}
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

              {/* Hover label — floats above icon */}
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
      </div>
    </motion.nav>
  );
}
