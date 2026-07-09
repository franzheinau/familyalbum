import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PostGallery from "@/components/PostGallery";
import ShareButton from "@/components/ShareButton";

export const dynamic = "force-dynamic";

function formatDate(dateStr) {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(dateStr));
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

  return (
    <main className="relative z-[1] min-h-screen">
      <div className="mx-auto max-w-3xl px-6 pt-10 pb-24">
        <Link href="/" className="polaroid-caption text-sm text-clay-dark hover:underline">← kembali ke album</Link>

        <article className="mt-8">
          <p className="polaroid-caption text-sm text-ink-soft">{formatDate(post.eventDate)}</p>
          <h1 className="mt-2 font-display text-3xl italic text-ink sm:text-4xl">{post.title}</h1>
          <ShareButton title={post.title} />

          <PostGallery photos={post.photos} title={post.title} />

          {post.caption && (
            <p className="mt-8 whitespace-pre-wrap font-display text-lg leading-relaxed text-ink-soft">{post.caption}</p>
          )}
        </article>
      </div>
    </main>
  );
}