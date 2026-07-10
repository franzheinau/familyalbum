import Link from "next/link";
import { prisma } from "@/lib/db";
import TimelineView from "@/components/TimelineView";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const posts = await prisma.post.findMany({
    orderBy: { eventDate: "asc" },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
  });

  return (
    <main className="relative z-[1] min-h-screen">
      <header className="mx-auto max-w-5xl px-6 pt-14 pb-8 text-center sm:pt-20">
        <p className="polaroid-caption text-sm tracking-widest uppercase text-clay-dark">
          Linimasa
        </p>
        <h1 className="mt-3 font-display text-4xl italic text-ink sm:text-5xl">
          Perjalanan Kenangan
        </h1>
        <div className="mt-5 flex justify-center gap-2">
          <Link
            href="/"
            className="rounded-full border border-ink-soft/30 px-4 py-1.5 text-sm text-ink-soft hover:border-clay hover:text-clay-dark"
          >
            Tampilan Galeri
          </Link>
          <Link
            href="/map"
            className="rounded-full border border-ink-soft/30 px-4 py-1.5 text-sm text-ink-soft hover:border-clay hover:text-clay-dark"
          >
            Peta Kenangan
          </Link>
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="mx-auto max-w-sm rounded-lg border border-dashed border-ink-soft/30 py-16 text-center">
          <p className="font-display text-xl text-ink">Album masih kosong</p>
        </div>
      ) : (
        <TimelineView posts={posts} />
      )}
    </main>
  );
}
