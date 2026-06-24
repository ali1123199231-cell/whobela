"use client";

type Photo = { id: string; url: string };

const MAX_PHOTOS = 6;

export function PhotoManager({
  photos,
  busy,
  onAdd,
  onDelete,
  onReorder,
  onClose,
}: {
  photos: Photo[];
  busy: boolean;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  onClose: () => void;
}) {
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;
    const ids = photos.map((p) => p.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    onReorder(ids);
  }

  function setAsCover(index: number) {
    if (index === 0) return;
    const ids = photos.map((p) => p.id);
    const [id] = ids.splice(index, 1);
    ids.unshift(id);
    onReorder(ids);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-rose-950">Your photos</h2>
          <button onClick={onClose} aria-label="Close" className="text-rose-400">
            ✕
          </button>
        </div>
        <p className="mt-1 text-sm text-rose-700/70">
          The first photo is your cover. Tap another photo to make it the cover.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={photo.id} className="relative">
              <button
                onClick={() => setAsCover(index)}
                disabled={busy}
                className={`h-24 w-full overflow-hidden rounded-xl ${index === 0 ? "ring-2 ring-[var(--dp-accent,#f43f5e)]" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" className="h-full w-full object-cover" />
              </button>
              {index === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Cover
                </span>
              )}
              <button
                onClick={() => onDelete(photo.id)}
                disabled={busy}
                aria-label="Delete photo"
                className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white"
              >
                ✕
              </button>
              <div className="mt-1 flex justify-center gap-2">
                <button
                  onClick={() => move(index, -1)}
                  disabled={busy || index === 0}
                  aria-label="Move earlier"
                  className="rounded-full bg-rose-50 px-2 text-xs text-rose-600 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={busy || index === photos.length - 1}
                  aria-label="Move later"
                  className="rounded-full bg-rose-50 px-2 text-xs text-rose-600 disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}

          {photos.length < MAX_PHOTOS && (
            <button
              onClick={onAdd}
              disabled={busy}
              className="flex h-24 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-rose-300 text-rose-400"
            >
              <span className="text-2xl">+</span>
              <span className="text-xs">Add</span>
            </button>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-rose-400">{photos.length}/{MAX_PHOTOS} photos</p>
      </div>
    </div>
  );
}
