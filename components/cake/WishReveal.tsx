"use client";

import { motion, AnimatePresence } from "framer-motion";

const WISH_PARAGRAPHS = [
  "You did it. You blew them out.",
  "Now close your eyes for just a second. Make a wish — a real one. The kind you actually want, not the safe version.",
  "And while your eyes are closed, know this: someone already wished for you. For your happiness. For your health. For NEET to go exactly the way you've worked for. For every hard day to be followed by a soft one.",
  "For you to feel, at least once today, how extraordinary you are.",
  "Happy birthday, Nandani. Happy birthday, lomri. Happy birthday, twin.",
  "This one's for you. 🦊🎂✨",
];

export default function WishReveal({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center z-40 p-6"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(251,191,36,0.12) 0%, rgba(253,242,248,0.96) 60%, #fdf2f8 100%)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="max-w-lg w-full text-center flex flex-col items-center gap-5">
            {/* Crown */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              style={{ fontSize: "48px" }}
            >
              🎂
            </motion.div>

            {WISH_PARAGRAPHS.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.18, duration: 0.6 }}
                className={
                  i === 0
                    ? "font-display text-2xl tracking-wide"
                    : i === WISH_PARAGRAPHS.length - 1
                    ? "font-hand text-2xl"
                    : "font-hand text-base leading-relaxed"
                }
                style={{
                  color: i === 0 ? "#7c3aed" : "#7a5c3e",
                  fontSize: i === 0 ? undefined : i === WISH_PARAGRAPHS.length - 1 ? "22px" : "15.5px",
                  lineHeight: "1.85",
                }}
              >
                {para}
              </motion.p>
            ))}

            {/* Decorative rule */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              className="h-px w-24 mx-auto mt-2"
              style={{ backgroundColor: "rgba(201,136,107,0.3)" }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1 }}
              className="font-hand text-sm"
              style={{ color: "rgba(122,92,62,0.4)" }}
            >
              made with every bit of care
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
