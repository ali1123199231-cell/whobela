import Link from "next/link";
import { format, parseISO } from "date-fns";
import { EditableText } from "./editable-text";
import type { ConfirmationConfig } from "@/lib/date-page-defaults";

export function ConfirmationStep({
  config,
  date,
  time,
  editable = false,
  onChange,
}: {
  config: ConfirmationConfig;
  date: string;
  time: string;
  editable?: boolean;
  onChange?: (patch: Partial<ConfirmationConfig>) => void;
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
          <Link href="/" className="font-medium text-rose-500 underline">
            Create your own date invitation
          </Link>
        </div>
      )}
    </div>
  );
}
