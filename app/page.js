import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/db";
import PhotoCard from "@/components/PhotoCard";
import OnThisDay from "@/components/OnThisDay";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-dynamic";

async function getYears() {
  const posts = await prisma.post.findMany({ select: { eventDate: true } });
  const years = new Set(posts.map((p) => new Date(p.eventDate).getFullYear()));
  return Array.from(years).sort((a, b) => b - a);
}

async function getPosts(year, query) {
  const where = {};
  if (year) {
    where.eventDate = {
      gte: new Date(`${year}-01-01T00:00:00.000Z`),
      lt: new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`),
    };
  }
  if (query) {
    where.title = { contains: query, mode: "insensitive" };
  }
  return prisma.post.findMany({
    where,
    orderBy: { eventDate: "desc" },
    include: { photos: { orderBy: { order: "asc" } } },
  });
}

async function getStats() {
  const total = await prisma.post.count();
  const oldest = await prisma.post.findFirst({ orderBy: { eventDate: "asc" } });
  return { total, sinceYear: oldest ? new Date(oldest.eventDate).getFullYear() : null };
}

async function getOnThisDay() {
  const today = new Date();
  const posts = await prisma.post.findMany({
    where: { eventDate: { lt: new Date(`${today.getFullYear()}-01-01T00:00:00.000Z`) } },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
  });
  const matches = posts.filter((p) => {
    const d = new Date(p.eventDate);
    return d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  });
  if (matches.length === 0) return null;
  const picked = matches[Math.floor(Math.random() * matches.length)];
  return {
    post: picked,
    yearsAgo: today.getFullYear() - new Date(picked.eventDate).getFullYear(),
  };
}

export default async function HomePage({ searchParams }) {
  const selectedYear = searchParams?.tahun || null;
  const query = searchParams?.cari || "";

  const [years, posts, stats, onThisDay] = await Promise.all([
    getYears(),
    getPosts(selectedYear, query),
    getStats(),
    query ? Promise.resolve(null) : getOnThisDay(),
  ]);

  return (
    <main className="relative z-[1] min-h-screen">
      <header className="mx-auto max-w-5xl px-6 pt-14 pb-8 text-center sm:pt-20">
        <p className="polaroid-caption text-sm tracking-widest uppercase text-clay-dark">
          Album Digital
        </p>
        <h1 className="mt-3 font-display text-4xl italic text-ink sm:text-5xl">
          Kenangan Rifaldi,Teman & Keluarga
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          Setiap foto punya cerita. Ini tempat Saya menyimpannya — supaya tidak hilang
          ditelan waktu. -Rifaldi
        </p>
        {stats.total > 0 && (
          <p className="polaroid-caption mt-3 text-xs text-ink-soft/70">
            {stats.total} kenangan tersimpan{stats.sinceYear ? ` sejak ${stats.sinceYear}` : ""}
          </p>
        )}
        <div className="mt-5 flex justify-center gap-2">
          <Link
            href="/timeline"
            className="rounded-full border border-ink-soft/30 px-4 py-1.5 text-sm text-ink-soft hover:border-clay hover:text-clay-dark"
          >
            Linimasa
          </Link>
          <Link
            href="/map"
            className="rounded-full border border-ink-soft/30 px-4 py-1.5 text-sm text-ink-soft hover:border-clay hover:text-clay-dark"
          >
            Peta Kenangan
          </Link>
        </div>
      </header>

      {onThisDay && (
        <div className="px-6">
          <OnThisDay post={onThisDay.post} yearsAgo={onThisDay.yearsAgo} />
        </div>
      )}

      <div className="mx-auto mb-6 max-w-5xl px-6">
        <Suspense fallback={<div className="h-10" />}>
          <SearchBar />
        </Suspense>
      </div>

      {years.length > 0 && (
        <nav className="scrollbar-thin mx-auto mb-10 flex max-w-5xl gap-2 overflow-x-auto px-6 pb-2">
          <Link
            href="/"
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-body transition ${
              !selectedYear
                ? "border-clay bg-clay text-cream"
                : "border-ink-soft/30 text-ink-soft hover:border-clay hover:text-clay-dark"
            }`}
          >
            Semua
          </Link>
          {years.map((year) => (
            <Link
              key={year}
              href={`/?tahun=${year}`}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-body transition ${
                selectedYear === String(year)
                  ? "border-clay bg-clay text-cream"
                  : "border-ink-soft/30 text-ink-soft hover:border-clay hover:text-clay-dark"
              }`}
            >
              {year}
            </Link>
          ))}
        </nav>
      )}

      <section className="mx-auto max-w-6xl px-6 pb-24">
        {posts.length === 0 ? (
          <div className="mx-auto max-w-sm rounded-lg border border-dashed border-ink-soft/30 py-16 text-center">
            <p className="font-display text-xl text-ink">
              {query ? "Tidak ada yang cocok" : "Album masih kosong"}
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              {query
                ? `Coba kata kunci lain selain "${query}".`
                : "Belum ada kenangan yang tersimpan untuk saat ini."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {posts.map((post, index) => (
              <PhotoCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </section>

      <footer className="mx-auto max-w-5xl px-6 pb-10 text-center">
        <Link href="/admin/login" className="text-xs text-ink-soft/50 hover:text-ink-soft">
          masuk sebagai Saya -Rifaldi
        </Link>
      </footer>
    </main>
  );
}
