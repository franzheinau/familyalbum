"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import BlurImage from "./BlurImage";

export default function PostGallery({ photos, title }) {
  const [openIndex, setOpenIndex] = useState(null);
  const touchStartX = useRef(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );
  const showNext = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    function handleKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, showPrev, showNext]);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) showPrev();
    if (delta < -50) showNext();
    touchStartX.current = null;
  }

  const [cover, ...rest] = photos;

  return (
    <>
      {cover && (
        <button type="button" onClick={() => setOpenIndex(0)} className="polaroid mt-8 -rotate-1 block w-full text-left">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper">
            <BlurImage src={cover.url} alt={title} fill sizes="(max-width: 768px) 100vw, 700px" className="object-cover" priority />
          </div>
        </button>
      )}

      {rest.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {rest.map((photo, i) => (
            <button
              type="button"
              key={photo.id}
              onClick={() => setOpenIndex(i + 1)}
              className={`polaroid block text-left ${i % 2 === 0 ? "rotate-1" : "-rotate-2"}`}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-paper">
                <BlurImage src={photo.url} alt={`${title} - foto ${i + 2}`} fill sizes="(max-width: 640px) 45vw, 220px" className="object-cover" />
              </div>
            </button>
          ))}
        </div>
      )}

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 px-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button type="button" onClick={close} className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-2xl text-cream hover:bg-cream/20" aria-label="Tutup">×</button>

          {photos.length > 1 && (
            <button type="button" onClick={showPrev} className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-2xl text-cream hover:bg-cream/20 sm:left-5" aria-label="Sebelumnya">‹</button>
          )}

          <div className="relative h-[80vh] w-full max-w-3xl">
            <img src={photos[openIndex].url} alt={`${title} - foto ${openIndex + 1}`} className="h-full w-full object-contain" />
          </div>

          {photos.length > 1 && (
            <button type="button" onClick={showNext} className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-2xl text-cream hover:bg-cream/20 sm:right-5" aria-label="Berikutnya">›</button>
          )}

          {photos.length > 1 && (
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 polaroid-caption text-xs text-cream/70">{openIndex + 1} / {photos.length}</p>
          )}
        </div>
      )}
    </>
  );
}