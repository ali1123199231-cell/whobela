"use client";

import { useState } from "react";
import type { PreferenceConfig } from "@/lib/date-page-defaults";

export function PreferenceStep({
  config,
  editable = false,
  onChange,
  onContinue,
}: {
  config: PreferenceConfig;
  editable?: boolean;
  onChange?: (patch: Partial<PreferenceConfig>) => void;
  onContinue: (selections: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [editingOptions, setEditingOptions] = useState(false);

  function toggle(label: string) {
    if (config.multiSelect) {
      setSelected((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
    } else {
      setSelected([label]);
    }
  }

  function updateOption(index: number, field: "emoji" | "label", value: string) {
    onChange?.({
      options: config.options.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt)),
    });
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-[var(--dp-heading)]">{config.question}</h1>
        {editable && (
          <button
            type="button"
            onClick={() => setEditingOptions((v) => !v)}
            aria-label="Edit preference options"
            className="rounded-full bg-white/80 p-1.5 text-rose-500 shadow-sm"
          >
            ⚙️
          </button>
        )}
      </div>

      {editable && editingOptions && (
        <div className="w-full max-w-xs rounded-2xl bg-white p-4 text-left shadow-xl shadow-rose-200">
          <label className="flex flex-col gap-1 text-sm font-medium text-rose-800">
            Question
            <input
              className="field"
              value={config.question}
              onChange={(e) => onChange?.({ question: e.target.value })}
            />
          </label>
          <label className="mt-3 flex items-center gap-2 text-sm font-medium text-rose-800">
            <input
              type="checkbox"
              checked={config.multiSelect}
              onChange={(e) => onChange?.({ multiSelect: e.target.checked })}
            />
            Allow multiple selections
          </label>
          <div className="mt-3 flex flex-col gap-2">
            {config.options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="field w-14 text-center"
                  value={opt.emoji}
                  onChange={(e) => updateOption(i, "emoji", e.target.value)}
                />
                <input
                  className="field flex-1"
                  value={opt.label}
                  onChange={(e) => updateOption(i, "label", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => onChange?.({ options: config.options.filter((_, idx) => idx !== i) })}
                  className="text-rose-400"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange?.({ options: [...config.options, { emoji: "✨", label: "New option" }] })}
              className="w-fit text-sm font-medium text-rose-500"
            >
              + Add option
            </button>
          </div>
        </div>
      )}

      <div className="grid w-full max-w-xs grid-cols-3 gap-3">
        {config.options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => toggle(opt.label)}
            className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-medium ${
              selected.includes(opt.label) ? "border-[var(--dp-accent)] bg-[var(--dp-accent)] text-white" : "border-rose-200 text-rose-700"
            }`}
          >
            <span className="text-2xl">{opt.emoji}</span>
            {opt.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => onContinue(selected)}
        className="rounded-full bg-[var(--dp-accent)] px-7 py-3 text-base font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-[var(--dp-accent-hover)]"
      >
        Continue
      </button>
    </div>
  );
}
