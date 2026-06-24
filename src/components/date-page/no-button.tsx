"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { NoConfig } from "@/lib/date-page-defaults";

// Difficulty no longer caps how many times the button can dodge — it's
// uncatchable whenever playful mode is on. It only changes how aggressively
// the button evades: higher tiers dodge on proximity (pointermove), not just
// on contact.
const DIFFICULTY = {
  easy: { proximity: 0 },
  medium: { proximity: 60 },
  hard: { proximity: 110 },
} as const;

export function NoButton({
  config,
  containerRef,
  onClick,
}: {
  config: NoConfig;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onClick: () => void;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [messageIndex, setMessageIndex] = useState(0);
  const lastDodgeAt = useRef(0);

  const { proximity } = DIFFICULTY[config.difficulty] ?? DIFFICULTY.medium;
  const label = config.messages[messageIndex % config.messages.length] ?? "No";

  function dodge() {
    const now = Date.now();
    if (now - lastDodgeAt.current < 120) return; // avoid jittering on rapid-fire events
    lastDodgeAt.current = now;

    const container = containerRef.current;
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    const maxX = Math.max(0, bounds.width - 140) / 2;
    const maxY = Math.max(0, bounds.height - 200) / 2;
    const nextX = (Math.random() * 2 - 1) * maxX;
    const nextY = (Math.random() * 2 - 1) * maxY;
    setOffset({ x: nextX, y: nextY });
    setMessageIndex((i) => i + 1);
  }

  function handlePointerEnter() {
    if (!config.enabled) return;
    dodge();
  }

  function handlePointerMove() {
    if (!config.enabled || proximity === 0) return;
    dodge();
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (!config.enabled) return;
    e.preventDefault();
    dodge();
  }

  if (!config.enabled) {
    return (
      <button
        onClick={onClick}
        className="rounded-full border border-rose-300 px-6 py-3 text-base font-semibold text-rose-400 transition hover:bg-rose-50"
      >
        No 😢
      </button>
    );
  }

  return (
    <motion.button
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onClick={(e) => e.preventDefault()}
      style={{ touchAction: "none" }}
      className="rounded-full border border-rose-300 px-6 py-3 text-base font-semibold text-rose-400 transition hover:bg-rose-50"
    >
      {label}
    </motion.button>
  );
}
