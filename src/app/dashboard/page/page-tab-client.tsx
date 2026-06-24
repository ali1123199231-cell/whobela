"use client";

import { useEffect, useRef, useState } from "react";
import { DatePageView, type DatePageConfigPatch } from "@/components/date-page";
import { PhotoCropper } from "@/components/photo-cropper";
import { PhotoManager } from "@/components/date-page/photo-manager";
import { getTrialEndsAt, formatCountdown } from "@/lib/date-page-status";
import type { DatePage } from "@/generated/prisma/client";

type Photo = { id: string; url: string };

export function PageTabClient({
  datePage,
  photos: initialPhotos,
  subscriptionActive,
  liveUrl,
  initialNow,
}: {
  datePage: DatePage;
  photos: Photo[];
  subscriptionActive: boolean;
  liveUrl: string;
  initialNow: number;
}) {
  const [config, setConfig] = useState({
    theme: datePage.theme,
    inviteConfig: datePage.inviteConfig,
    yesConfig: datePage.yesConfig,
    noConfig: datePage.noConfig,
    reactionConfig: datePage.reactionConfig,
    schedulingConfig: datePage.schedulingConfig,
    preferenceConfig: datePage.preferenceConfig,
    confirmationConfig: datePage.confirmationConfig,
  });
  const [status, setStatus] = useState(datePage.status);
  const [firstPublishedAt, setFirstPublishedAt] = useState(datePage.firstPublishedAt);
  const [photos, setPhotos] = useState(initialPhotos);
  const [managingPhotos, setManagingPhotos] = useState(false);
  const [photosBusy, setPhotosBusy] = useState(false);
  const [editMode, setEditMode] = useState(datePage.status === "DRAFT");
  const [publishing, setPublishing] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  // Seeded from the server's clock (via prop) rather than Date.now(), to
  // avoid a hydration mismatch if this loads while already published.
  const [now, setNow] = useState(initialNow);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (status !== "PUBLISHED" || subscriptionActive) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [status, subscriptionActive]);

  function handleConfigUpdate(patch: DatePageConfigPatch) {
    setConfig((prev) => ({ ...prev, ...patch }));
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      fetch("/api/page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    }, 500);
  }

  async function handlePublish() {
    setPublishing(true);
    const res = await fetch("/api/page/publish", { method: "POST" });
    setPublishing(false);
    if (res.ok) {
      const data = await res.json();
      setStatus(data.datePage.status);
      setFirstPublishedAt(data.datePage.firstPublishedAt ? new Date(data.datePage.firstPublishedAt) : null);
      setEditMode(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function handleCropped(blob: Blob) {
    setPendingImage(null);
    setPhotosBusy(true);
    const formData = new FormData();
    formData.append("file", blob, "photo.jpg");
    formData.append("kind", "PROFILE_PHOTO");
    const res = await fetch("/api/media", { method: "POST", body: formData });
    setPhotosBusy(false);
    if (res.ok) {
      const data = await res.json();
      setPhotos((prev) => [...prev, { id: data.id, url: `/api/media/${data.id}` }]);
    }
  }

  async function handleDeletePhoto(id: string) {
    setPhotosBusy(true);
    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    setPhotosBusy(false);
    if (res.ok) setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleReorderPhotos(orderedIds: string[]) {
    const byId = new Map(photos.map((p) => [p.id, p]));
    setPhotos(orderedIds.map((id) => byId.get(id)!));
    setPhotosBusy(true);
    await fetch("/api/media/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: orderedIds }),
    });
    setPhotosBusy(false);
  }

  const trialEndsAt = getTrialEndsAt(firstPublishedAt);
  const trialMsLeft = trialEndsAt ? trialEndsAt.getTime() - now : null;
  const isLive = status === "PUBLISHED" && (subscriptionActive || (trialMsLeft !== null && trialMsLeft > 0));

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 bg-white px-4 py-2.5 text-sm">
        <div>
          {status === "DRAFT" && <span className="font-medium text-rose-400">Draft — not live yet</span>}
          {status === "PUBLISHED" && subscriptionActive && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-rose-600 underline">
              Live: {liveUrl}
            </a>
          )}
          {status === "PUBLISHED" && !subscriptionActive && isLive && trialMsLeft !== null && (
            <span className="font-medium text-rose-600">
              Live — free preview ends in {formatCountdown(trialMsLeft)}
            </span>
          )}
          {status === "PUBLISHED" && !subscriptionActive && !isLive && (
            <span className="font-medium text-rose-400">Your free preview window ended</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {status === "PUBLISHED" && !subscriptionActive && (
            <a href="/dashboard/billing" className="text-rose-500 underline">
              {isLive ? "Subscribe to keep it running" : "Subscribe to go live again"}
            </a>
          )}
          {status === "DRAFT" && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="rounded-full bg-rose-500 px-4 py-1.5 font-semibold text-white disabled:opacity-60"
            >
              {publishing ? "Publishing..." : "Publish"}
            </button>
          )}
          <label className="flex items-center gap-1.5 font-medium text-rose-700">
            <input type="checkbox" checked={editMode} onChange={(e) => setEditMode(e.target.checked)} />
            Edit mode
          </label>
        </div>
      </div>

      <div className="flex-1">
        <DatePageView
          datePageId={datePage.id}
          mode={editMode ? "edit" : "live"}
          config={config}
          photoUrls={photos.map((p) => p.url)}
          onConfigUpdate={handleConfigUpdate}
          onPhotoTap={() => setManagingPhotos(true)}
        />
      </div>

      <input id="page-photo-input" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      {pendingImage && (
        <PhotoCropper imageSrc={pendingImage} onCancel={() => setPendingImage(null)} onCropped={handleCropped} />
      )}
      {managingPhotos && !pendingImage && (
        <PhotoManager
          photos={photos}
          busy={photosBusy}
          onAdd={() => document.getElementById("page-photo-input")?.click()}
          onDelete={handleDeletePhoto}
          onReorder={handleReorderPhotos}
          onClose={() => setManagingPhotos(false)}
        />
      )}
    </div>
  );
}
