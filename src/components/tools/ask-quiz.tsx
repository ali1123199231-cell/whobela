"use client";

import { useState } from "react";

type Answer = "online" | "person" | "shy" | "bold";

const RESULTS: Record<string, { title: string; advice: string }> = {
  "online-shy": {
    title: "Send a personalized invitation",
    advice:
      "You mostly talk online and feel nervous — perfect case for a personalized invitation. It does the brave part for you and gives them space to say yes.",
  },
  "online-bold": {
    title: "A confident message with a real plan",
    advice:
      "You're comfortable online and confident — send a clear, specific ask: a genuine compliment, a real plan, and an easy yes. Or elevate it with an invitation.",
  },
  "person-shy": {
    title: "A low-pressure in-person ask",
    advice:
      "Ask in a calm, private moment for something small and specific — coffee or a walk. Keep it short; confidence grows once you start.",
  },
  "person-bold": {
    title: "Just ask — directly and warmly",
    advice:
      "You've got the rapport and the nerve. Be direct and specific: \"I'd love to take you out this week — are you free?\"",
  },
};

export function AskQuiz() {
  const [setting, setSetting] = useState<Answer | null>(null);
  const [confidence, setConfidence] = useState<Answer | null>(null);

  const key =
    setting && confidence
      ? `${setting === "online" ? "online" : "person"}-${confidence === "shy" ? "shy" : "bold"}`
      : null;
  const result = key ? RESULTS[key] : null;

  return (
    <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
      <fieldset>
        <legend className="text-sm font-medium text-rose-700">How do you mostly talk?</legend>
        <div className="mt-2 flex gap-2">
          <Choice active={setting === "online"} onClick={() => setSetting("online")}>
            Mostly online
          </Choice>
          <Choice active={setting === "person"} onClick={() => setSetting("person")}>
            In person
          </Choice>
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-rose-700">How are you feeling?</legend>
        <div className="mt-2 flex gap-2">
          <Choice active={confidence === "shy"} onClick={() => setConfidence("shy")}>
            A little nervous
          </Choice>
          <Choice active={confidence === "bold"} onClick={() => setConfidence("bold")}>
            Pretty confident
          </Choice>
        </div>
      </fieldset>

      {result && (
        <div className="mt-6 rounded-2xl bg-rose-50 p-6">
          <h2 className="text-lg font-semibold text-rose-950">{result.title}</h2>
          <p className="mt-2 leading-relaxed text-rose-800/90">{result.advice}</p>
        </div>
      )}
    </div>
  );
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
        active ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-100"
      }`}
    >
      {children}
    </button>
  );
}
