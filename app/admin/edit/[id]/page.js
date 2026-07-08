import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import AdminPostForm from "@/components/AdminPostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!post) notFound();

  return (
    <main className="relative z-[1] min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
        <p className="polaroid-caption text-sm text-ink-soft">Ubah kenangan</p>
        <h1 className="mb-8 font-display text-3xl italic text-ink">{post.title}</h1>
        <AdminPostForm mode="edit" initialPost={JSON.parse(JSON.stringify(post))} />
      </div>
    </main>
  );
}
