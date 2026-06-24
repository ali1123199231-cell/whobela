"use client";

import { useState } from "react";
import Link from "next/link";
import { InviteStep } from "./invite-step";
import { Celebration } from "./celebration";
import { ReactionStep } from "./reaction-step";
import { SchedulingStep } from "./scheduling-step";
import { PreferenceStep } from "./preference-step";
import { BookerStep, type BookerInfo } from "./booker-step";
import { ConfirmationStep } from "./confirmation-step";
import {
  withDefaults,
  getTheme,
  DEFAULT_INVITE_CONFIG,
  DEFAULT_YES_CONFIG,
  DEFAULT_NO_CONFIG,
  DEFAULT_REACTION_CONFIG,
  DEFAULT_SCHEDULING_CONFIG,
  DEFAULT_PREFERENCE_CONFIG,
  DEFAULT_CONFIRMATION_CONFIG,
  type InviteConfig,
  type YesConfig,
  type NoConfig,
  type ReactionConfig,
  type SchedulingConfig,
  type PreferenceConfig,
  type ConfirmationConfig,
  type ThemeKey,
} from "@/lib/date-page-defaults";

type Step =
  | "invite"
  | "celebrating"
  | "reaction"
  | "scheduling"
  | "preference"
  | "booker"
  | "confirmation"
  | "declined"
  | "demo-cta";

export type DatePageConfigBundle = {
  theme?: unknown;
  inviteConfig: unknown;
  yesConfig: unknown;
  noConfig: unknown;
  reactionConfig: unknown;
  schedulingConfig: unknown;
  preferenceConfig: unknown;
  confirmationConfig: unknown;
};

export type DatePageConfigPatch = {
  theme?: ThemeKey;
  inviteConfig?: InviteConfig;
  yesConfig?: YesConfig;
  noConfig?: NoConfig;
  reactionConfig?: ReactionConfig;
  schedulingConfig?: SchedulingConfig;
  preferenceConfig?: PreferenceConfig;
  confirmationConfig?: ConfirmationConfig;
};

export function DatePageView({
  datePageId,
  mode,
  config,
  photoUrls = [],
  onConfigUpdate,
  onPhotoTap,
}: {
  datePageId: string;
  mode: "live" | "edit" | "demo";
  config: DatePageConfigBundle;
  photoUrls?: string[];
  onConfigUpdate?: (patch: DatePageConfigPatch) => void;
  onPhotoTap?: () => void;
}) {
  const editable = mode === "edit";
  const isDemo = mode === "demo";
  const theme = getTheme(config.theme);
  const inviteConfig = withDefaults(config.inviteConfig, DEFAULT_INVITE_CONFIG);
  const yesConfig = withDefaults(config.yesConfig, DEFAULT_YES_CONFIG);
  const noConfig = withDefaults(config.noConfig, DEFAULT_NO_CONFIG);
  const reactionConfig = withDefaults(config.reactionConfig, DEFAULT_REACTION_CONFIG);
  const schedulingConfig = withDefaults(config.schedulingConfig, DEFAULT_SCHEDULING_CONFIG);
  const preferenceConfig = withDefaults(config.preferenceConfig, DEFAULT_PREFERENCE_CONFIG);
  const confirmationConfig = withDefaults(config.confirmationConfig, DEFAULT_CONFIRMATION_CONFIG);

  const [step, setStep] = useState<Step>("invite");
  const [schedule, setSchedule] = useState<{ date: string; time: string } | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleBookerSubmit(info: BookerInfo) {
    if (mode === "edit" || !schedule) {
      setStep("confirmation");
      return;
    }
    const res = await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        datePageId,
        recipientName: info.recipientName,
        recipientContact: {
          instagram: info.instagram,
          whatsapp: info.whatsapp,
          facebook: info.facebook,
          phone: info.phone,
          email: info.email,
        },
        recipientMessage: info.recipientMessage,
        preferenceSelections: preferences,
        chosenDate: schedule.date,
        chosenTime: schedule.time,
        timezone: schedulingConfig.timezone,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSubmitError(data.error ?? "Something went wrong, please try again");
      return;
    }
    setStep("confirmation");
  }

  return (
    <div
      style={
        {
          "--dp-from": theme.from,
          "--dp-to": theme.to,
          "--dp-accent": theme.accent,
          "--dp-accent-hover": theme.accentHover,
          "--dp-heading": theme.heading,
        } as React.CSSProperties
      }
      className="relative flex h-full min-h-screen flex-col bg-gradient-to-b from-[var(--dp-from)] to-[var(--dp-to)]"
    >
      {editable && step !== "invite" && (
        <button
          onClick={() => setStep("invite")}
          className="absolute left-3 top-3 z-50 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-rose-600 shadow-sm"
        >
          ← Back to start
        </button>
      )}

      {step === "invite" && (
        <InviteStep
          inviteConfig={inviteConfig}
          yesConfig={yesConfig}
          noConfig={noConfig}
          photoUrls={photoUrls}
          editable={editable}
          theme={config.theme as ThemeKey}
          onThemeChange={(nextTheme) => onConfigUpdate?.({ theme: nextTheme })}
          onInviteChange={(patch) => onConfigUpdate?.({ inviteConfig: { ...inviteConfig, ...patch } })}
          onYesChange={(patch) => onConfigUpdate?.({ yesConfig: { ...yesConfig, ...patch } })}
          onNoChange={(patch) => onConfigUpdate?.({ noConfig: { ...noConfig, ...patch } })}
          onPhotoTap={onPhotoTap}
          onYes={() => setStep("celebrating")}
          onNo={() => setStep("declined")}
        />
      )}

      {step === "celebrating" && (
        <>
          <InviteStep
            inviteConfig={inviteConfig}
            yesConfig={yesConfig}
            noConfig={noConfig}
            photoUrls={photoUrls}
            onYes={() => {}}
            onNo={() => {}}
          />
          <Celebration style={yesConfig.celebration} onDone={() => setStep("reaction")} />
        </>
      )}

      {step === "reaction" && (
        <ReactionStep
          config={reactionConfig}
          editable={editable}
          onChange={(patch) => onConfigUpdate?.({ reactionConfig: { ...reactionConfig, ...patch } })}
          onContinue={() => setStep("scheduling")}
        />
      )}

      {step === "scheduling" && (
        <SchedulingStep
          config={schedulingConfig}
          editable={editable}
          onChange={(patch) => onConfigUpdate?.({ schedulingConfig: { ...schedulingConfig, ...patch } })}
          onContinue={(date, time) => {
            setSchedule({ date, time });
            if (isDemo) {
              setStep("demo-cta");
              return;
            }
            setStep(preferenceConfig.options.length > 0 ? "preference" : "booker");
          }}
        />
      )}

      {step === "preference" && (
        <PreferenceStep
          config={preferenceConfig}
          editable={editable}
          onChange={(patch) => onConfigUpdate?.({ preferenceConfig: { ...preferenceConfig, ...patch } })}
          onContinue={(selections) => {
            setPreferences(selections);
            setStep("booker");
          }}
        />
      )}

      {step === "booker" && (
        <div className="flex h-full flex-col">
          <BookerStep onContinue={handleBookerSubmit} />
          {submitError && <p className="pb-4 text-center text-sm text-red-500">{submitError}</p>}
        </div>
      )}

      {step === "confirmation" && schedule && (
        <ConfirmationStep
          config={confirmationConfig}
          editable={editable}
          onChange={(patch) => onConfigUpdate?.({ confirmationConfig: { ...confirmationConfig, ...patch } })}
          date={schedule.date}
          time={schedule.time}
        />
      )}

      {step === "demo-cta" && (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <span className="text-5xl">🌸</span>
          <p className="text-2xl font-semibold text-[var(--dp-heading)]">
            That&apos;s the magic ✨
          </p>
          <p className="max-w-sm text-[var(--dp-heading)]/70">
            Make your own page like this — your photo, your question, your style — and
            send it to someone special.
          </p>
          <Link
            href="/signup"
            className="mt-2 rounded-full bg-[var(--dp-accent)] px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[var(--dp-accent-hover)]"
          >
            Create your date page
          </Link>
          <button
            onClick={() => setStep("invite")}
            className="text-sm font-medium text-[var(--dp-heading)]/60 underline"
          >
            Replay the demo
          </button>
        </div>
      )}

      {step === "declined" && (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="text-5xl">😢</span>
          <p className="text-xl font-semibold text-rose-900">Maybe next time</p>
          {isDemo && (
            <button
              onClick={() => setStep("invite")}
              className="mt-2 text-sm font-medium text-rose-600 underline"
            >
              Try the demo again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
