"use client";

import { useRef, useState } from "react";
import { NoButton } from "./no-button";
import { NoButtonSettings } from "./no-button-settings";
import { YesButtonSettings } from "./yes-button-settings";
import { ThemePicker } from "./theme-picker";
import { EditableText } from "./editable-text";
import { PhotoLightbox } from "./photo-lightbox";
import type { InviteConfig, NoConfig, YesConfig, ThemeKey } from "@/lib/date-page-defaults";
import { DEFAULT_THEME } from "@/lib/date-page-defaults";

export function InviteStep({
  inviteConfig,
  yesConfig,
  noConfig,
  photoUrls = [],
  editable = false,
  theme,
  onThemeChange,
  onInviteChange,
  onYesChange,
  onNoChange,
  onPhotoTap,
  onYes,
  onNo,
}: {
  inviteConfig: InviteConfig;
  yesConfig: YesConfig;
  noConfig: NoConfig;
  photoUrls?: string[];
  editable?: boolean;
  theme?: ThemeKey;
  onThemeChange?: (theme: ThemeKey) => void;
  onInviteChange?: (patch: Partial<InviteConfig>) => void;
  onYesChange?: (patch: Partial<YesConfig>) => void;
  onNoChange?: (patch: Partial<NoConfig>) => void;
  onPhotoTap?: () => void;
  onYes: () => void;
  onNo: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const coverUrl = photoUrls[0];

  function handlePhotoTap(index: number) {
    if (editable) {
      onPhotoTap?.();
      return;
    }
    if (photoUrls.length > 0) setLightboxIndex(index);
  }

  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <button type="button" onClick={() => handlePhotoTap(0)} className="group relative h-28 w-28 rounded-full">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="" className="h-28 w-28 rounded-full object-cover shadow-lg" />
        ) : (
          <span className="text-6xl">{inviteConfig.emoji}</span>
        )}
        {editable && (
          <span className="absolute -bottom-1 -right-1 rounded-full bg-[var(--dp-accent)] px-1.5 py-1 text-xs text-white shadow">
            📷
          </span>
        )}
      </button>

      {!editable && photoUrls.length > 1 && (
        <div className="flex gap-2">
          {photoUrls.slice(1).map((url, i) => (
            <button key={url} onClick={() => handlePhotoTap(i + 1)} className="h-12 w-12 overflow-hidden rounded-full shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <PhotoLightbox photoUrls={photoUrls} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}

      {editable && <ThemePicker value={theme ?? DEFAULT_THEME} onChange={(t) => onThemeChange?.(t)} />}

      <EditableText
        as="h1"
        multiline
        className="text-2xl font-semibold text-[var(--dp-heading)]"
        value={inviteConfig.question}
        editable={editable}
        onChange={(value) => onInviteChange?.({ question: value })}
      />
      {(inviteConfig.subtitle || editable) && (
        <EditableText
          as="p"
          className="text-rose-700/70"
          value={inviteConfig.subtitle}
          placeholder="Add a subtitle (optional)"
          editable={editable}
          onChange={(value) => onInviteChange?.({ subtitle: value })}
        />
      )}

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onYes}
            className="rounded-full bg-[var(--dp-accent)] px-7 py-3 text-base font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-[var(--dp-accent-hover)]"
          >
            {yesConfig.buttonText}
          </button>
          {editable && <YesButtonSettings config={yesConfig} onChange={(patch) => onYesChange?.(patch)} />}
        </div>

        <div className="flex items-center gap-2">
          {editable ? (
            <button
              onClick={onNo}
              className="rounded-full border border-rose-300 px-6 py-3 text-base font-semibold text-rose-400 transition hover:bg-rose-50"
            >
              {noConfig.messages[0] ?? "No"}
            </button>
          ) : (
            <NoButton config={noConfig} containerRef={containerRef} onClick={onNo} />
          )}
          {editable && <NoButtonSettings config={noConfig} onChange={(patch) => onNoChange?.(patch)} />}
        </div>
      </div>
    </div>
  );
}
