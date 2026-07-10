import Link from "next/link";
import AdminPostForm from "@/components/AdminPostForm";

export default function NewPostPage() {
  return (
    <main className="relative z-[1] min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
        <p className="polaroid-caption text-sm text-ink-soft">Kenangan baru</p>
        <h1 className="mb-4 font-display text-3xl italic text-ink">Tambah Foto</h1>
        <Link
          href="/admin"
          className="mb-8 inline-flex items-center text-sm font-medium text-clay-dark transition hover:text-clay"
        >
          ← Kembali ke dashboard
        </Link>
        <AdminPostForm mode="create" />
      </div>
    </main>
  );
}
