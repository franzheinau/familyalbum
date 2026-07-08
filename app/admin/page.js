import { prisma } from "@/lib/db";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const posts = await prisma.post.findMany({
    orderBy: { eventDate: "desc" },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  return (
    <main className="relative z-[1] min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <AdminDashboard posts={JSON.parse(JSON.stringify(posts))} />
      </div>
    </main>
  );
}
