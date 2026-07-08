"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

function formatDate(dateStr) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

export default function AdminDashboard({ posts }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  async function handleDelete(id) {
    if (!confirm("Hapus kenangan ini beserta semua fotonya? Tindakan ini tidak bisa dibatalkan.")) {
      return;
    }
    setError("");
    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menghapus.");
      }
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="polaroid-caption text-sm text-ink-soft">Panel Admin</p>
          <h1 className="font-display text-3xl italic text-ink">Kelola Album</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/new"
            className="rounded-md bg-clay px-4 py-2 font-body font-medium text-cream hover:bg-clay-dark"
          >
            + Kenangan baru
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-md border border-ink-soft/30 px-4 py-2 font-body text-ink-soft hover:border-ink-soft"
          >
            Keluar
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-clay/40 bg-clay/10 px-4 py-2 text-sm text-clay-dark">
          {error}
        </p>
      )}

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink-soft/30 py-16 text-center">
          <p className="font-display text-xl text-ink">Belum ada kenangan</p>
          <p className="mt-2 text-sm text-ink-soft">Mulai dengan menambahkan yang pertama.</p>
        </div>
      ) : (
        <div className="divide-y divide-ink-soft/15 rounded-lg border border-ink-soft/15 bg-paper/40">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-paper">
                {post.photos[0] && (
                  <Image src={post.photos[0].url} alt="" fill className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg text-ink">{post.title}</p>
                <p className="polaroid-caption text-xs text-ink-soft">
                  {formatDate(post.eventDate)} · {post.photos.length} foto
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/edit/${post.id}`}
                  className="rounded-md border border-ink-soft/30 px-3 py-1.5 text-sm text-ink-soft hover:border-clay hover:text-clay-dark"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                  className="rounded-md border border-clay/40 px-3 py-1.5 text-sm text-clay-dark hover:bg-clay/10 disabled:opacity-50"
                >
                  {deletingId === post.id ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
