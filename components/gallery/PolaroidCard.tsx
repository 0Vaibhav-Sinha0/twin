"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { GalleryCard } from "@/data/gallery";
import Image from "next/image";

const CATEGORY_COLORS: Record<GalleryCard["category"], string> = {
  funny:     "#c9886b",
  emotional: "#9f7aea",
  random:    "#4a6b5a",
  milestone: "#3aa9ff",
};

interface PolaroidCardProps {
  card: GalleryCard;
  index: number;
}

export default function PolaroidCard({ card, index }: PolaroidCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: card.rotation }}
      animate={{ opacity: 1, y: 0, rotate: card.rotation }}
      transition={{
        duration: 0.6,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        rotate: 0,
        scale: 1.03,
        transition: { duration: 0.25, ease: "easeOut" },
        zIndex: 10,
      }}
      onClick={() => setFlipped((f) => !f)}
      className="cursor-pointer select-none"
      style={{
        perspective: "1000px",
        width: "220px",
        margin: "0 auto",
      }}
    >
      {/* Flip container */}
      <div
        style={{
          position: "relative",
          width: "220px",
          height: "280px",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* ── FRONT ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div
            className="flex flex-col"
            style={{
              width: "220px",
              height: "280px",
              backgroundColor: "#fefcf7",
              padding: "12px 12px 20px",
              boxShadow:
                "0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)",
              borderRadius: "2px",
            }}
          >
            {/* Photo area */}
            <div
              className="relative flex-1 overflow-hidden"
              style={{
                backgroundColor: card.placeholderColor,
                borderRadius: "1px",
              }}
            >
              {card.src ? (
                <Image
                  src={card.src}
                  alt={card.caption}
                  fill
                  className="object-cover"
                  sizes="220px"
                />
              ) : (
                /* Placeholder — shows colour + fox when no image */
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${card.placeholderColor}cc, ${card.placeholderColor}66)`,
                  }}
                >
                  <span style={{ fontSize: "36px", opacity: 0.6 }}>🦊</span>
                  <span
                    className="font-display text-xs tracking-widest opacity-40"
                    style={{ color: "#fefcf7" }}
                  >
                    photo here
                  </span>
                </div>
              )}

              {/* Category pill */}
              <div
                className="absolute top-2 right-2 font-display text-center"
                style={{
                  fontSize: "8px",
                  letterSpacing: "0.15em",
                  color: "#fefcf7",
                  background: `${CATEGORY_COLORS[card.category]}cc`,
                  backdropFilter: "blur(4px)",
                  padding: "2px 7px",
                  borderRadius: "20px",
                  textTransform: "uppercase",
                }}
              >
                {card.category}
              </div>
            </div>

            {/* Caption area — handwritten feel */}
            <div className="pt-3 px-1">
              <p
                className="font-hand leading-snug"
                style={{
                  fontSize: "14px",
                  color: "#7a5c3e",
                  marginBottom: "4px",
                }}
              >
                {card.caption}
              </p>
              <p
                className="font-hand opacity-40"
                style={{ fontSize: "11px", color: "#7a5c3e" }}
              >
                {card.date}
              </p>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className="flex flex-col items-center justify-center gap-4 p-6"
            style={{
              width: "220px",
              height: "280px",
              backgroundColor: "#fefcf7",
              boxShadow:
                "0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)",
              borderRadius: "2px",
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 27px, rgba(122,92,62,0.08) 27px, rgba(122,92,62,0.08) 28px)",
              backgroundPositionY: "32px",
            }}
          >
            {/* Decorative top line */}
            <div
              className="w-8 h-px"
              style={{ backgroundColor: "rgba(201,136,107,0.4)" }}
            />

            {/* Back message */}
            <p
              className="font-hand text-center leading-relaxed"
              style={{
                fontSize: "13.5px",
                color: "#7a5c3e",
                lineHeight: "1.75",
              }}
            >
              {card.backMessage}
            </p>

            {/* Fox signature */}
            <div className="flex flex-col items-center gap-1 mt-2">
              <span style={{ fontSize: "18px" }}>🦊</span>
              <p
                className="font-hand opacity-35"
                style={{ fontSize: "10px", color: "#7a5c3e" }}
              >
                tap to flip back
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
