"use client";

import { useEffect, useState } from "react";
import { PhotoCropper } from "@/components/photo-cropper";
import { LogoutButton } from "../logout-button";

type Profile = {
  firstName: string;
  nickname?: string | null;
  age?: number | null;
  location?: string | null;
  occupation?: string | null;
  hobbies?: string | null;
  interests?: string | null;
  favoriteActivities?: string | null;
  personalityDescription?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
  whatsapp?: string | null;
};

type Photo = { id: string };

const MAX_PHOTOS = 6;

const emptyProfile: Profile = { firstName: "" };

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) setProfile(data.profile);
        if (data.photos) setPhotos(data.photos);
        setLoading(false);
      });
  }, []);

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
    const formData = new FormData();
    formData.append("file", blob, "photo.jpg");
    formData.append("kind", "PROFILE_PHOTO");
    const res = await fetch("/api/media", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setPhotos((prev) => [...prev, { id: data.id }]);
    }
  }

  async function handleDeletePhoto(id: string) {
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedMessage(null);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...profile,
        age: profile.age ? Number(profile.age) : null,
      }),
    });
    setSaving(false);
    setSavedMessage(res.ok ? "Saved ❤️" : "Something went wrong");
  }

  if (loading) return <p className="text-rose-400">Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-rose-950">Your profile</h1>
      <p className="mt-1 text-rose-700/70">
        Add more details to make your page feel personal ❤️ — everything except
        your first name is optional.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-400">Photos</h2>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/media/${photo.id}`} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => handleDeletePhoto(photo.id)}
                className="absolute right-1 top-1 hidden rounded-full bg-black/60 px-2 py-0.5 text-xs text-white group-hover:block"
              >
                ✕
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-rose-200 text-2xl text-rose-300 hover:border-rose-400">
              +
              <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </label>
          )}
        </div>
      </section>

      <form onSubmit={handleSave} className="mt-10 flex flex-col gap-4">
        <Field label="First name" required>
          <input
            className="field"
            required
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
          />
        </Field>
        <Field label="Nickname">
          <input className="field" value={profile.nickname ?? ""} onChange={(e) => setProfile({ ...profile, nickname: e.target.value })} />
        </Field>
        <Field label="Age">
          <input type="number" className="field" value={profile.age ?? ""} onChange={(e) => setProfile({ ...profile, age: e.target.value ? Number(e.target.value) : null })} />
        </Field>
        <Field label="Location">
          <input className="field" value={profile.location ?? ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
        </Field>
        <Field label="Occupation">
          <input className="field" value={profile.occupation ?? ""} onChange={(e) => setProfile({ ...profile, occupation: e.target.value })} />
        </Field>
        <Field label="Hobbies">
          <input className="field" value={profile.hobbies ?? ""} onChange={(e) => setProfile({ ...profile, hobbies: e.target.value })} />
        </Field>
        <Field label="Interests">
          <input className="field" value={profile.interests ?? ""} onChange={(e) => setProfile({ ...profile, interests: e.target.value })} />
        </Field>
        <Field label="Favorite activities">
          <input className="field" value={profile.favoriteActivities ?? ""} onChange={(e) => setProfile({ ...profile, favoriteActivities: e.target.value })} />
        </Field>
        <Field label="Personality description">
          <textarea className="field" rows={3} value={profile.personalityDescription ?? ""} onChange={(e) => setProfile({ ...profile, personalityDescription: e.target.value })} />
        </Field>
        <Field label="Instagram">
          <input className="field" value={profile.instagram ?? ""} onChange={(e) => setProfile({ ...profile, instagram: e.target.value })} />
        </Field>
        <Field label="TikTok">
          <input className="field" value={profile.tiktok ?? ""} onChange={(e) => setProfile({ ...profile, tiktok: e.target.value })} />
        </Field>
        <Field label="Facebook">
          <input className="field" value={profile.facebook ?? ""} onChange={(e) => setProfile({ ...profile, facebook: e.target.value })} />
        </Field>
        <Field label="WhatsApp">
          <input className="field" value={profile.whatsapp ?? ""} onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })} />
        </Field>

        {savedMessage && <p className="text-sm text-rose-500">{savedMessage}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 w-fit rounded-full bg-rose-500 px-6 py-2.5 font-semibold text-white hover:bg-rose-600 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>

      <div className="mt-10 border-t border-rose-100 pt-4 text-sm">
        <LogoutButton />
      </div>

      {pendingImage && (
        <PhotoCropper
          imageSrc={pendingImage}
          onCancel={() => setPendingImage(null)}
          onCropped={handleCropped}
        />
      )}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-rose-800">
        {label} {required && <span className="text-rose-400">*</span>}
      </span>
      {children}
    </label>
  );
}
