import Link from "next/link";
import nextDynamic from "next/dynamic";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const AllMemoriesMap = nextDynamic(() => import("@/components/AllMemoriesMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] items-center justify-center text-ink-soft">Memuat peta...</div>
  ),
});

export default async function MapPage() {
  const posts = await prisma.post.findMany({
    where: { latitude: { not: null }, longitude: { not: null } },
    orderBy: { eventDate: "desc" },
  });

  return (
    <main className="relative z-[1] min-h-screen">
      <header className="mx-auto max-w-5xl px-6 pt-14 pb-8 text-center sm:pt-20">
        <p className="polaroid-caption text-sm tracking-widest uppercase text-clay-dark">
          Peta Kenangan
        </p>
        <h1 className="mt-3 font-display text-4xl italic text-ink sm:text-5xl">
          Kemana Saja Kita Pergi
        </h1>
        <div className="mt-5 flex justify-center gap-2">
          <Link
            href="/"
            className="rounded-full border border-ink-soft/30 px-4 py-1.5 text-sm text-ink-soft hover:border-clay hover:text-clay-dark"
          >
            Tampilan Galeri
          </Link>
          <Link
            href="/timeline"
            className="rounded-full border border-ink-soft/30 px-4 py-1.5 text-sm text-ink-soft hover:border-clay hover:text-clay-dark"
          >
            Linimasa
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        {posts.length === 0 ? (
          <div className="mx-auto max-w-sm rounded-lg border border-dashed border-ink-soft/30 py-16 text-center">
            <p className="font-display text-xl text-ink">Belum ada lokasi tertandai</p>
            <p className="mt-2 text-sm text-ink-soft">
              Tandai lokasi saat menambah kenangan baru lewat halaman admin.
            </p>
          </div>
        ) : (
          <AllMemoriesMap posts={posts} />
        )}
      </section>
    </main>
  );
}
