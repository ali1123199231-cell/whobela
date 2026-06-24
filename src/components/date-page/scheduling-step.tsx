"use client";

import { useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import type { SchedulingConfig } from "@/lib/date-page-defaults";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildAvailableDates(config: SchedulingConfig) {
  const dates: { value: string; label: string }[] = [];
  for (let i = 0; i < config.dateRangeDays; i++) {
    const date = addDays(new Date(), i);
    if (config.availableDays.includes(date.getDay())) {
      dates.push({ value: format(date, "yyyy-MM-dd"), label: format(date, "EEE, MMM d") });
    }
  }
  return dates;
}

function buildTimeSlots(config: SchedulingConfig) {
  const slots: string[] = [];
  for (let hour = config.startHour; hour < config.endHour; hour++) {
    for (const minute of [0, 30]) {
      const h12 = hour % 12 === 0 ? 12 : hour % 12;
      const period = hour < 12 ? "AM" : "PM";
      slots.push(`${h12}:${minute === 0 ? "00" : "30"} ${period}`);
    }
  }
  return slots;
}

export function SchedulingStep({
  config,
  editable = false,
  onChange,
  onContinue,
}: {
  config: SchedulingConfig;
  editable?: boolean;
  onChange?: (patch: Partial<SchedulingConfig>) => void;
  onContinue: (date: string, time: string) => void;
}) {
  const dates = useMemo(() => buildAvailableDates(config), [config]);
  const times = useMemo(() => buildTimeSlots(config), [config]);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [editingAvailability, setEditingAvailability] = useState(false);

  function toggleDay(day: number) {
    onChange?.({
      availableDays: config.availableDays.includes(day)
        ? config.availableDays.filter((d) => d !== day)
        : [...config.availableDays, day],
    });
  }

  return (
    <div className="flex h-full flex-col items-center gap-6 overflow-y-auto px-6 py-10 text-center">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-[var(--dp-heading)]">So... when are you free?</h1>
        {editable && (
          <button
            type="button"
            onClick={() => setEditingAvailability((v) => !v)}
            aria-label="Edit availability"
            className="rounded-full bg-white/80 p-1.5 text-rose-500 shadow-sm"
          >
            ⚙️
          </button>
        )}
      </div>

      {editable && editingAvailability && (
        <div className="w-full max-w-xs rounded-2xl bg-white p-4 text-left shadow-xl shadow-rose-200">
          <p className="text-sm font-semibold text-rose-800">Bookable days</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DAY_LABELS.map((label, day) => (
              <button
                key={label}
                type="button"
                onClick={() => toggleDay(day)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  config.availableDays.includes(day) ? "bg-[var(--dp-accent)] text-white" : "border border-rose-200 text-rose-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm font-medium text-rose-800">
              Start hour (0-23)
              <input
                type="number"
                className="field"
                value={config.startHour}
                onChange={(e) => onChange?.({ startHour: Number(e.target.value) })}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-rose-800">
              End hour (0-23)
              <input
                type="number"
                className="field"
                value={config.endHour}
                onChange={(e) => onChange?.({ endHour: Number(e.target.value) })}
              />
            </label>
          </div>
          <label className="mt-3 flex flex-col gap-1 text-sm font-medium text-rose-800">
            Timezone
            <input
              className="field"
              value={config.timezone}
              onChange={(e) => onChange?.({ timezone: e.target.value })}
            />
          </label>
          <label className="mt-3 flex flex-col gap-1 text-sm font-medium text-rose-800">
            Days ahead bookable
            <input
              type="number"
              className="field"
              value={config.dateRangeDays}
              onChange={(e) => onChange?.({ dateRangeDays: Number(e.target.value) })}
            />
          </label>
        </div>
      )}

      <div className="grid w-full max-w-xs grid-cols-3 gap-2">
        {dates.map((d) => (
          <button
            key={d.value}
            onClick={() => setDate(d.value)}
            className={`rounded-xl border px-2 py-2 text-xs font-medium ${
              date === d.value ? "border-[var(--dp-accent)] bg-[var(--dp-accent)] text-white" : "border-rose-200 text-rose-700"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <select
        value={time ?? ""}
        onChange={(e) => setTime(e.target.value)}
        className="field w-full max-w-xs bg-white"
      >
        <option value="" disabled>
          Pick a time
        </option>
        {times.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <button
        disabled={!date || !time}
        onClick={() => date && time && onContinue(date, time)}
        className="rounded-full bg-[var(--dp-accent)] px-7 py-3 text-base font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-[var(--dp-accent-hover)] disabled:opacity-40"
      >
        Set the date!
      </button>
    </div>
  );
}
