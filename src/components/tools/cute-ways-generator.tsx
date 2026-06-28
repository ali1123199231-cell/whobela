"use client";

import { useState } from "react";

const WHO = ["my crush", "my boyfriend", "my girlfriend", "a friend", "someone I met online"];
const VIBE = ["sweet", "funny", "romantic", "casual"];

const LINES: Record<string, string[]> = {
  sweet: [
    "You've been on my mind all week — would you let me take you out?",
    "I'd love an excuse to spend an evening with you. Dinner this weekend?",
  ],
  funny: [
    "On a scale of 1 to date, how free are you Friday?",
    "I did the math and we'd have a great time. Care to test the theory?",
  ],
  romantic: [
    "I keep imagining a perfect evening — and you're in all of them. Will you go out with me?",
    "Let me plan something special, just for you. Say yes?",
  ],
  casual: [
    "Want to grab coffee sometime this week? I'd really like to.",
    "Free this weekend? I've got a low-key date idea for us.",
  ],
};

export function CuteWaysGenerator() {
  const [who, setWho] = useState(WHO[0]);
  const [vibe, setVibe] = useState(VIBE[0]);
  const [line, setLine] = useState<string | null>(null);

  function generate() {
    const pool = LINES[vibe];
    setLine(pool[Math.floor(Math.random() * pool.length)]);
  }

  return (
    <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
      <label className="block text-sm font-medium text-rose-700">I&apos;m asking…</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {WHO.map((w) => (
          <button
            key={w}
            onClick={() => setWho(w)}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              who === w ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-100"
            }`}
          >
            {w}
          </button>
        ))}
      </div>

      <label className="mt-5 block text-sm font-medium text-rose-700">Vibe</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {VIBE.map((v) => (
          <button
            key={v}
            onClick={() => setVibe(v)}
            className={`rounded-full px-3 py-1.5 text-sm capitalize transition ${
              vibe === v ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-100"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={generate}
          className="rounded-full bg-rose-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
        >
          {line ? "Try another" : "Generate a cute way to ask"}
        </button>
      </div>

      {line && (
        <div className="mt-6 rounded-2xl bg-rose-50 p-6 text-center">
          <p className="text-lg text-rose-900">“{line}”</p>
          <p className="mt-2 text-sm text-rose-500/80">For {who}</p>
        </div>
      )}
    </div>
  );
}
