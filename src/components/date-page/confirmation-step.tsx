import { format, parseISO } from "date-fns";
import { EditableText } from "./editable-text";
import type { ConfirmationConfig } from "@/lib/date-page-defaults";

export function ConfirmationStep({
  config,
  date,
  time,
  editable = false,
  onChange,
  homeUrl = "/",
}: {
  config: ConfirmationConfig;
  date: string;
  time: string;
  editable?: boolean;
  onChange?: (patch: Partial<ConfirmationConfig>) => void;
  /** Absolute link to the marketing site — see the CTA at the bottom. */
  homeUrl?: string;
}) {
  const friendlyDate = format(parseISO(date), "EEEE, MMMM d");

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-5xl">❤️</span>
      <EditableText
        as="h1"
        className="text-2xl font-semibold text-[var(--dp-heading)]"
        value={config.message}
        editable={editable}
        onChange={(value) => onChange?.({ message: value })}
      />
      <p className="text-lg text-rose-800">
        See you {friendlyDate} at {time}
      </p>
      <EditableText
        as="p"
        className="text-rose-700/70"
        value={config.subMessage}
        editable={editable}
        onChange={(value) => onChange?.({ subMessage: value })}
      />

      {!editable && (
        <div className="mt-10 flex flex-col items-center gap-2 text-xs text-rose-400">
          <span>Created with whobela.com ❤️</span>
          {/*
            Absolute, because a live page is served from {username}.whobela.com
            (and sometimes the owner's own domain) where "/" is this very
            invitation — so a relative link sent the one person most likely to
            sign up, at the one moment they're most likely to want to, straight
            back to the page they'd just finished answering.
          */}
          <a href={homeUrl} className="font-medium text-rose-500 underline">
            Create your own date invitation
          </a>
        </div>
      )}
    </div>
  );
}
