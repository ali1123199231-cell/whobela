"use client";

import { useState } from "react";
import Link from "next/link";
import { DATE_IDEA_LIST } from "@/content/date-ideas";

const VIBES = ["Any", "Casual", "Romantic", "Adventurous", "Cozy"] as const;

function matchesVibe(vibe: string, filter: string) {
  if (filter === "Any") return true;
  return vibe.toLowerCase().includes(filter.toLowerCase());
}

export function DateIdeaGenerator() {
  const [filter, setFilter] = useState<string>("Any");
  const [pick, setPick] = useState<(typeof DATE_IDEA_LIST)[number] | null>(null);

  function generate() {
    const pool = DATE_IDEA_LIST.filter((d) => matchesVibe(d.vibe, filter));
    const list = pool.length ? pool : DATE_IDEA_LIST;
    setPick(list[Math.floor(Math.random() * list.length)]);
  }

  return (
    <div className="rounded-3xl border border-rose-100 bg-white p-6 text-center shadow-sm">
      <div className="flex flex-wrap justify-center gap-2">
        {VIBES.map((v) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === v
                ? "bg-rose-500 text-white"
                : "bg-rose-50 text-rose-600 hover:bg-rose-100"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <button
        onClick={generate}
        className="mt-6 rounded-full bg-rose-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
      >
        {pick ? "Another idea" : "Generate a date idea"}
      </button>

      {pick && (
        <div className="mt-6 rounded-2xl bg-rose-50 p-6">
          <div className="text-4xl">{pick.emoji}</div>
          <h2 className="mt-2 text-xl font-semibold text-rose-950">{pick.name}</h2>
          <p className="mt-1 text-rose-700/80">{pick.vibe}</p>
          <Link
            href={`/date-ideas/${pick.slug}`}
            className="mt-4 inline-block text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            See {pick.name.toLowerCase()} ideas →
          </Link>
        </div>
      )}
    </div>
  );
}
