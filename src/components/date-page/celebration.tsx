"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";

const EMOJIS: Record<string, string> = {
  confetti: "🎉",
  hearts: "❤️",
};

export function Celebration({
  style,
  onDone,
}: {
  style: "confetti" | "hearts" | "none";
  onDone: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDone, style === "none" ? 0 : 900);
    return () => clearTimeout(timer);
  }, [onDone, style]);

  // Purely decorative, client-only, one-shot animation — randomizing each
  // particle's position here is intentional and never affects render output
  // correctness, so the impure-call lint rule is disabled for this block.
  /* eslint-disable react-hooks/purity */
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map(() => ({
        x: Math.random() * 100,
        scale: 0.6 + Math.random() * 0.8,
        duration: 0.8 + Math.random() * 0.4,
      })),
    []
  );
  /* eslint-enable react-hooks/purity */

  if (style === "none") return null;
  const emoji = EMOJIS[style] ?? "🎉";

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, x: `${p.x}vw`, y: "60vh", scale: p.scale }}
          animate={{ y: "-10vh", opacity: 0 }}
          transition={{ duration: p.duration, ease: "easeOut" }}
          className="absolute text-3xl"
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}
