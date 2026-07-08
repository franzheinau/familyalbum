import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-[1] flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="polaroid-caption text-sm text-ink-soft">404</p>
      <h1 className="mt-2 font-display text-3xl italic text-ink">
        Halaman ini tidak ada dalam album
      </h1>
      <Link href="/" className="mt-6 text-clay-dark hover:underline">
        ← kembali ke album
      </Link>
    </main>
  );
}
