"use client";

import { useRef, useState } from "react";
import { DatePageView, type DatePageConfigPatch } from "@/components/date-page";
import { PhotoCropper } from "@/components/photo-cropper";
import { PhotoManager } from "@/components/date-page/photo-manager";
import { PushPrompt } from "@/components/push-prompt";
import { InstallPrompt } from "@/components/install-prompt";
import { useIsAndroid, useStandalone } from "@/lib/device";
import type { DatePage } from "@/generated/prisma/client";

type Photo = { id: string; url: string };

export function PageTabClient({
  datePage,
  photos: initialPhotos,
  liveUrl,
  vapidPublicKey,
  installPromptEnabled,
}: {
  datePage: DatePage;
  photos: Photo[];
  liveUrl: string;
  vapidPublicKey: string | null;
  installPromptEnabled: boolean;
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
  const [photos, setPhotos] = useState(initialPhotos);
  const [managingPhotos, setManagingPhotos] = useState(false);
  const [photosBusy, setPhotosBusy] = useState(false);
  const [editMode, setEditMode] = useState(datePage.status === "DRAFT");
  const [publishing, setPublishing] = useState(false);
  const [justPublished, setJustPublished] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Whether the publish moment offers the app instead of web push. Read through
  // the same external-store hooks the install card uses, so the server's render
  // and the client's first one agree instead of swapping a frame later.
  const android = useIsAndroid();
  const standalone = useStandalone();
  const offerTheApp = installPromptEnabled && android && !standalone;

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
      setEditMode(false);
      // The one moment they're certain to want answers delivered: the link is
      // live and about to go out. Set only here, never on load, so the prompt
      // can't appear to someone who just wandered onto this tab.
      setJustPublished(true);
    }
  }

  async function handleUnpublish() {
    // Confirmed because the recipient may already be holding the link, and the
    // page going dark is something they'd notice — but it is reversible, so a
    // plain confirm is enough weight.
    if (!confirm("Take your page offline? The link will stop working until you publish again. Your responses are kept.")) {
      return;
    }
    setPublishing(true);
    const res = await fetch("/api/page/publish", { method: "DELETE" });
    setPublishing(false);
    if (res.ok) {
      const data = await res.json();
      setStatus(data.datePage.status);
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

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 bg-white px-4 py-2.5 text-sm">
        <div>
          {status === "DRAFT" && <span className="font-medium text-rose-400">Draft — not live yet</span>}
          {status === "PUBLISHED" && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-rose-600 underline">
              Live: {liveUrl}
            </a>
          )}
        </div>

        <div className="flex items-center gap-3">
          {status === "DRAFT" && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="rounded-full bg-rose-500 px-4 py-1.5 font-semibold text-white disabled:opacity-60"
            >
              {publishing ? "Publishing..." : "Publish"}
            </button>
          )}
          {status === "PUBLISHED" && (
            <button
              onClick={handleUnpublish}
              disabled={publishing}
              className="rounded-full border border-rose-200 px-4 py-1.5 font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
            >
              {publishing ? "Working..." : "Take offline"}
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
      {justPublished &&
        (offerTheApp ? (
          <InstallPrompt onDismiss={() => setJustPublished(false)} />
        ) : (
          <PushPrompt
            placement="publish"
            vapidPublicKey={vapidPublicKey}
            onDismiss={() => setJustPublished(false)}
          />
        ))}
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
