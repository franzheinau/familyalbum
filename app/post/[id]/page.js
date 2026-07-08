import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatDate(dateStr) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

async function getPost(id) {
  return prisma.post.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });
}

export default async function PostDetailPage({ params }) {
  const post = await getPost(params.id);
  if (!post) notFound();

  const [cover, ...rest] = post.photos;

  return (
    <main className="relative z-[1] min-h-screen">
      <div className="mx-auto max-w-3xl px-6 pt-10 pb-24">
        <Link href="/" className="polaroid-caption text-sm text-clay-dark hover:underline">
          ← kembali ke album
        </Link>

        <article className="mt-8">
          <p className="polaroid-caption text-sm text-ink-soft">{formatDate(post.eventDate)}</p>
          <h1 className="mt-2 font-display text-3xl italic text-ink sm:text-4xl">
            {post.title}
          </h1>

          {cover && (
            <div className="polaroid mt-8 -rotate-1">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper">
                <Image
                  src={cover.url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {post.caption && (
            <p className="mt-8 whitespace-pre-wrap font-display text-lg leading-relaxed text-ink-soft">
              {post.caption}
            </p>
          )}

          {rest.length > 0 && (
            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {rest.map((photo, i) => (
                <div key={photo.id} className={`polaroid ${i % 2 === 0 ? "rotate-1" : "-rotate-2"}`}>
                  <div className="relative aspect-square w-full overflow-hidden bg-paper">
                    <Image
                      src={photo.url}
                      alt={`${post.title} - foto ${i + 2}`}
                      fill
                      sizes="(max-width: 640px) 45vw, 220px"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </main>
  );
}
