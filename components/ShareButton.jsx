"use client";

export default function ShareButton({ title }) {
  function handleShare() {
    const url = window.location.href;
    const text = encodeURIComponent(`${title} — lihat kenangan ini: ${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink-soft/30 px-4 py-1.5 text-sm text-ink-soft transition hover:border-clay hover:text-clay-dark"
    >
      Bagikan ke WhatsApp
    </button>
  );
}