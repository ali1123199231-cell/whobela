"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  DatePageView,
  type DatePageConfigBundle,
  type DatePageConfigPatch,
} from "@/components/date-page";
import {
  subscribeToDraft,
  getDraftSnapshot,
  getServerDraftSnapshot,
  writeDraft,
} from "@/lib/draft-page";
import { DEFAULT_THEME } from "@/lib/date-page-defaults";

export function CreateClient() {
  // localStorage is the source of truth, not component state — see draft-page
  // for why this is a subscription rather than an effect that restores it.
  const config = useSyncExternalStore(subscribeToDraft, getDraftSnapshot, getServerDraftSnapshot);

  function handleConfigUpdate(patch: DatePageConfigPatch) {
    writeDraft(patch);
  }

  // A saved page carries every config column, so the bundle's keys are all
  // required; a draft only holds what's been touched. Naming each one keeps
  // that difference visible instead of casting it away — DatePageView runs
  // withDefaults over each field, so the gaps render as the defaults.
  const bundle: DatePageConfigBundle = {
    // Named explicitly so the theme picker shows a swatch as selected on an
    // untouched draft; the rest render their defaults with nothing chosen yet.
    theme: config.theme ?? DEFAULT_THEME,
    inviteConfig: config.inviteConfig,
    yesConfig: config.yesConfig,
    noConfig: config.noConfig,
    reactionConfig: config.reactionConfig,
    schedulingConfig: config.schedulingConfig,
    preferenceConfig: config.preferenceConfig,
    confirmationConfig: config.confirmationConfig,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 bg-white px-4 py-2.5 text-sm">
        <span className="font-medium text-rose-400">
          Tap anything to change it — nothing is saved yet
        </span>
        <Link
          href="/signup"
          className="rounded-full bg-rose-500 px-4 py-1.5 font-semibold text-white transition hover:bg-rose-600"
        >
          Save &amp; get my link
        </Link>
      </div>

      <div className="flex-1">
        {/* Photos are deliberately absent: uploading needs somewhere to put the
            file and someone to own it, so the photo affordance appears once
            there's an account. Omitting onPhotoTap leaves the tap inert. */}
        <DatePageView datePageId="draft" mode="edit" config={bundle} onConfigUpdate={handleConfigUpdate} />
      </div>

      <div className="border-t border-rose-100 bg-white px-4 py-3 text-center text-sm text-rose-700/70">
        Happy with it?{" "}
        <Link href="/signup" className="font-semibold text-rose-600 underline">
          Create your account
        </Link>{" "}
        to publish this page and hear the moment they answer.
      </div>
    </div>
  );
}
