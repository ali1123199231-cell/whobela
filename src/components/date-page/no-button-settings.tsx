"use client";

import { useState } from "react";
import type { NoConfig } from "@/lib/date-page-defaults";

export function NoButtonSettings({
  config,
  onChange,
}: {
  config: NoConfig;
  onChange: (patch: Partial<NoConfig>) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Edit No button settings"
        className="rounded-full bg-white/80 p-1.5 text-rose-500 shadow-sm"
      >
        ⚙️
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-2xl bg-white p-4 text-left shadow-xl shadow-rose-200"
        >
          <label className="flex items-center gap-2 text-sm font-medium text-rose-800">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => onChange({ enabled: e.target.checked })}
            />
            Playful mode (dodges forever)
          </label>
          <label className="mt-3 flex flex-col gap-1 text-sm font-medium text-rose-800">
            Dodge intensity
            <select
              className="field"
              value={config.difficulty}
              onChange={(e) => onChange({ difficulty: e.target.value as NoConfig["difficulty"] })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <label className="mt-3 flex flex-col gap-1 text-sm font-medium text-rose-800">
            Messages (comma separated)
            <input
              className="field"
              value={config.messages.join(", ")}
              onChange={(e) =>
                onChange({ messages: e.target.value.split(",").map((m) => m.trim()).filter(Boolean) })
              }
            />
          </label>
        </div>
      )}
    </div>
  );
}
