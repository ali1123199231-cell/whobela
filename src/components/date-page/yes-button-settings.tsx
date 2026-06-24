"use client";

import { useState } from "react";
import type { YesConfig } from "@/lib/date-page-defaults";

export function YesButtonSettings({
  config,
  onChange,
}: {
  config: YesConfig;
  onChange: (patch: Partial<YesConfig>) => void;
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
        aria-label="Edit Yes button"
        className="rounded-full bg-white/80 p-1.5 text-rose-500 shadow-sm"
      >
        ✏️
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-2xl bg-white p-4 text-left shadow-xl shadow-rose-200"
        >
          <label className="flex flex-col gap-1 text-sm font-medium text-rose-800">
            Button text
            <input
              className="field"
              value={config.buttonText}
              onChange={(e) => onChange({ buttonText: e.target.value })}
            />
          </label>
          <label className="mt-3 flex flex-col gap-1 text-sm font-medium text-rose-800">
            Celebration
            <select
              className="field"
              value={config.celebration}
              onChange={(e) => onChange({ celebration: e.target.value as YesConfig["celebration"] })}
            >
              <option value="confetti">Confetti</option>
              <option value="hearts">Hearts</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
