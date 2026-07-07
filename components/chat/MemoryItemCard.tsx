"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { MemoryItem, MemoryType } from "@/data/chatMemories";

const TYPE_CONFIG: Record<
  MemoryType,
  { label: string; color: string; icon: string }
> = {
  screenshot: { label: "screenshot", color: "#3aa9ff", icon: "📸" },
  voice:      { label: "voice note", color: "#9f7aea", icon: "🎙" },
  moment:     { label: "moment",     color: "#c9886b", icon: "✦"  },
  joke:       { label: "inside joke",color: "#f59e0b", icon: "💀" },
  emotional:  { label: "emotional",  color: "#ec4899", icon: "🫂" },
  random:     { label: "random",     color: "#4a6b5a", icon: "🌿" },
};

interface MemoryItemCardProps {
  memory: MemoryItem;
  index: number;
}

export default function MemoryItemCard({ memory, index }: MemoryItemCardProps) {
  const config = TYPE_CONFIG[memory.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${config.color}22`,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Image / placeholder area — only shown for screenshot type or if imageSrc provided */}
      {(memory.type === "screenshot" || memory.imageSrc) && (
        <div
          className="relative w-full flex items-center justify-center"
          style={{
            height: "140px",
            backgroundColor: memory.placeholderColor ?? "#0b1230",
            background: `linear-gradient(135deg, ${memory.placeholderColor ?? "#0b1230"}, #05070f)`,
          }}
        >
          {memory.imageSrc ? (
            <Image
              src={memory.imageSrc}
              alt={memory.caption}
              fill
              className="object-cover"
              sizes="300px"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-30">
              <span style={{ fontSize: "28px" }}>📱</span>
              <span
                className="font-display text-xs tracking-widest"
                style={{ color: "var(--text-primary)" }}
              >
                screenshot
              </span>
            </div>
          )}
        </div>
      )}

      {/* Voice note visual */}
      {memory.type === "voice" && !memory.imageSrc && (
        <div
          className="flex items-center justify-center gap-1 px-4"
          style={{
            height: "72px",
            background: `linear-gradient(135deg, ${memory.placeholderColor ?? "#1a0f30"}, #05070f)`,
          }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: "3px",
                backgroundColor: config.color,
                height: `${8 + Math.sin(i * 0.8) * 16 + Math.sin(i * 1.5) * 8}px`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2">
        {/* Type tag */}
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: "11px" }}>{config.icon}</span>
          <span
            className="font-display"
            style={{
              fontSize: "9px",
              letterSpacing: "0.15em",
              color: config.color,
              textTransform: "uppercase",
            }}
          >
            {config.label}
          </span>
          {memory.reaction && (
            <span className="ml-auto" style={{ fontSize: "14px" }}>
              {memory.reaction}
            </span>
          )}
        </div>

        {/* Caption */}
        <p
          className="font-hand leading-relaxed"
          style={{
            fontSize: "13.5px",
            color: "var(--text-secondary)",
            lineHeight: "1.7",
          }}
        >
          {memory.caption}
        </p>
      </div>
    </motion.div>
  );
}
