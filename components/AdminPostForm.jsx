"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

async function uploadToImageKit(file, onProgress) {
  const authRes = await fetch("/api/imagekit-auth");
  if (!authRes.ok) throw new Error("Gagal mengambil izin upload. Coba login ulang.");
  const auth = await authRes.json();

  const form = new FormData();
  form.append("file", file);
  form.append("fileName", file.name);
  form.append("publicKey", auth.publicKey);
  form.append("signature", auth.signature);
  form.append("token", auth.token);
  form.append("expire", auth.expire);
  form.append("folder", "/family-gallery");
  form.append("useUniqueFileName", "true");

  const uploadRes = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error("Upload foto gagal."));
      }
    };
    xhr.onerror = () => reject(new Error("Upload foto gagal. Cek koneksi internet."));
    xhr.send(form);
  });

  return { url: uploadRes.url, fileId: uploadRes.fileId };
}

export default function AdminPostForm({ mode = "create", initialPost = null }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialPost?.title || "");
  const [eventDate, setEventDate] = useState(
    initialPost?.eventDate ? initialPost.eventDate.slice(0, 10) : ""
  );
  const [caption, setCaption] = useState(initialPost?.caption || "");
  const [photos, setPhotos] = useState(initialPost?.photos || []); // {id?, url, fileId}
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setError("");
    setUploading(true);
    try {
      for (const file of files) {
        setUploadProgress(0);
        const uploaded = await uploadToImageKit(file, setUploadProgress);
        setPhotos((prev) => [...prev, uploaded]);
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat upload.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = "";
    }
  }

  function removePhoto(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title || !eventDate || photos.length === 0) {
      setError("Judul, tanggal, dan minimal satu foto wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      const payload = { title, eventDate, caption, photos };
      const url = mode === "edit" ? `/api/posts/${initialPost.id}` : "/api/posts";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menyimpan kenangan.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-md border border-clay/40 bg-clay/10 px-4 py-2 text-sm text-clay-dark">
          {error}
        </p>
      )}

      <div>
        <label className="block font-body text-sm font-medium text-ink-soft">Judul</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Liburan ke Rumah Nenek"
          className="mt-1 w-full rounded-md border border-ink-soft/30 bg-cream px-3 py-2 font-body text-ink focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
      </div>

      <div>
        <label className="block font-body text-sm font-medium text-ink-soft">Tanggal kenangan</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="mt-1 w-full rounded-md border border-ink-soft/30 bg-cream px-3 py-2 font-body text-ink focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
      </div>

      <div>
        <label className="block font-body text-sm font-medium text-ink-soft">
          Cerita / caption <span className="text-ink-soft/50">(opsional)</span>
        </label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={5}
          placeholder="Tuliskan cerita di balik foto ini, kalau mau..."
          className="mt-1 w-full rounded-md border border-ink-soft/30 bg-cream px-3 py-2 font-body text-ink focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
        />
      </div>

      <div>
        <label className="block font-body text-sm font-medium text-ink-soft">Foto</label>
        <div className="mt-2 flex flex-wrap gap-3">
          {photos.map((photo, index) => (
            <div key={photo.fileId || photo.id} className="relative h-24 w-24 overflow-hidden rounded-md border border-ink-soft/20">
              <Image src={photo.url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-xs text-cream"
                aria-label="Hapus foto"
              >
                ×
              </button>
            </div>
          ))}
          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-ink-soft/30 text-center text-xs text-ink-soft hover:border-clay hover:text-clay-dark">
            {uploading ? `${uploadProgress}%` : "+ Tambah"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesSelected}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-md bg-clay px-5 py-2 font-body font-medium text-cream transition hover:bg-clay-dark disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : mode === "edit" ? "Simpan perubahan" : "Simpan kenangan"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-md border border-ink-soft/30 px-5 py-2 font-body text-ink-soft hover:border-ink-soft"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
