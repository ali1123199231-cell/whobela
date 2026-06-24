"use client";

import { useState } from "react";
import { THEMES, type ThemeKey } from "@/lib/date-page-defaults";

export function ThemePicker({
  value,
  onChange,
}: {
  value: ThemeKey;
  onChange: (theme: ThemeKey) => void;
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
        aria-label="Choose a theme"
        className="rounded-full bg-white/80 p-1.5 text-rose-500 shadow-sm"
      >
        🎨
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-2xl bg-white p-3 text-left shadow-xl shadow-rose-200"
        >
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(THEMES) as [ThemeKey, (typeof THEMES)[ThemeKey]][]).map(([key, theme]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                title={theme.label}
                className={`flex h-12 flex-col items-center justify-center rounded-xl border-2 ${
                  value === key ? "border-rose-500" : "border-transparent"
                }`}
                style={{ background: `linear-gradient(to bottom, ${theme.from}, ${theme.to})` }}
              >
                <span className="h-3 w-3 rounded-full" style={{ background: theme.accent }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
