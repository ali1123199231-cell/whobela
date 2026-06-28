"use client";

import { useState } from "react";

const QUESTIONS = [
  "What's something you're weirdly passionate about?",
  "What's your go-to comfort movie?",
  "What's the best trip you've ever taken?",
  "Morning person or night owl?",
  "What's a small thing that always makes your day?",
  "What were you like as a kid?",
  "What's your ideal weekend?",
  "What's a skill you'd love to learn?",
  "Coffee, tea, or neither?",
  "What's the last thing that made you laugh out loud?",
  "What's your hidden talent?",
  "Where do you feel most yourself?",
  "What's a song you can't skip?",
  "What's something on your bucket list?",
  "Who's someone you really admire, and why?",
  "What's your favorite way to be taken care of?",
  "Beach, mountains, or city?",
  "What's a memory you'd happily relive?",
];

function sample(n: number) {
  return [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, n);
}

export function FirstDateQuestions() {
  const [set, setSet] = useState<string[]>(() => sample(5));

  return (
    <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
      <ul className="space-y-3">
        {set.map((q) => (
          <li key={q} className="flex gap-3 text-rose-800/90">
            <span className="text-rose-400">♥</span>
            <span>{q}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-center">
        <button
          onClick={() => setSet(sample(5))}
          className="rounded-full bg-rose-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
        >
          New questions
        </button>
      </div>
    </div>
  );
}
