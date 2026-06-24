"use client";

import { useState } from "react";

export function PhotoLightbox({
  photoUrls,
  startIndex,
  onClose,
}: {
  photoUrls: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  function goTo(next: number) {
    setIndex((next + photoUrls.length) % photoUrls.length);
  }

  function handlePointerDown(e: React.PointerEvent) {
    setTouchStartX(e.clientX);
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (touchStartX === null) return;
    const delta = e.clientX - touchStartX;
    setTouchStartX(null);
    if (delta > 50) goTo(index - 1);
    else if (delta < -50) goTo(index + 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 rounded-full bg-white/20 px-3 py-1.5 text-lg font-medium text-white"
      >
        ✕
      </button>

      <div
        className="relative flex h-[70vh] w-full max-w-md items-center justify-center"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        {photoUrls.length > 1 && (
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Previous photo"
            className="absolute left-1 z-10 rounded-full bg-white/20 px-3 py-2 text-xl text-white"
          >
            ‹
          </button>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrls[index]}
          alt=""
          className="max-h-full max-w-full rounded-2xl object-contain"
          draggable={false}
        />
        {photoUrls.length > 1 && (
          <button
            onClick={() => goTo(index + 1)}
            aria-label="Next photo"
            className="absolute right-1 z-10 rounded-full bg-white/20 px-3 py-2 text-xl text-white"
          >
            ›
          </button>
        )}
      </div>

      {photoUrls.length > 1 && (
        <div className="mt-4 flex gap-2">
          {photoUrls.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
