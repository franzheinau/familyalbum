"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login gagal.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative z-[1] flex min-h-screen items-center justify-center px-6 py-10">
      <div className="polaroid relative z-10 w-full max-w-sm -rotate-1 !pb-8">
        <div className="px-2 pt-2">
          <p className="polaroid-caption text-center text-sm text-ink-soft">Area Admin</p>
          <h1 className="mt-1 text-center font-display text-2xl italic text-ink">
            Masuk ke Album
          </h1>

          <Link
            href="/"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-ink-soft/20 bg-cream/95 px-3 py-2 text-sm font-medium text-clay-dark shadow-sm transition hover:bg-paper"
          >
            ← Kembali ke halaman utama
          </Link>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <p className="rounded-md border border-clay/40 bg-clay/10 px-3 py-2 text-sm text-clay-dark">
                {error}
              </p>
            )}
            <div>
              <label className="block text-sm font-medium text-ink-soft">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="mt-1 w-full rounded-md border border-ink-soft/30 bg-cream px-3 py-2 text-ink focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-soft">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="mt-1 w-full rounded-md border border-ink-soft/30 bg-cream px-3 py-2 text-ink focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-clay py-2 font-medium text-cream transition hover:bg-clay-dark disabled:opacity-50"
            >
              {loading ? "Memeriksa..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
