# Album Kenangan Keluarga

Website galeri foto kenangan keluarga, bertema hangat & vintage. Dibuat dengan Next.js, siap deploy ke Vercel. Foto disimpan di ImageKit, data post disimpan di database Postgres lewat Prisma. Hanya kamu yang bisa login ke halaman admin untuk menambah/mengedit/menghapus kenangan.

## Yang perlu disiapkan sebelum jalan

1. **Database Postgres** — paling gampang pakai [Neon](https://neon.tech) (gratis, tinggal daftar & buat project, nanti dapat `DATABASE_URL`). Vercel Postgres juga bisa (sekarang sama-sama dari Neon).
2. **Akun ImageKit** — daftar gratis di [imagekit.io](https://imagekit.io). Setelah daftar, buka **Developer Options** untuk dapat:
   - Public Key
   - Private Key
   - URL Endpoint (bentuknya `https://ik.imagekit.io/namamu`)

## 1. Jalankan di komputer sendiri (opsional, buat coba-coba dulu)

```bash
npm install
cp .env.example .env
# isi semua nilai di .env sesuai akun Neon & ImageKit kamu
npx prisma migrate dev --name init
npm run dev
```

Buka `http://localhost:3000` untuk lihat galeri, dan `http://localhost:3000/admin/login` untuk masuk sebagai admin (pakai `ADMIN_USERNAME` & `ADMIN_PASSWORD` yang kamu isi di `.env`).

## 2. Deploy ke Vercel

1. Push folder ini ke repo GitHub kamu.
2. Buka [vercel.com](https://vercel.com) → **New Project** → pilih repo tadi.
3. Di bagian **Environment Variables**, isi semua variabel yang ada di `.env.example`:
   - `DATABASE_URL`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET` (isi string acak panjang, misalnya hasil dari `openssl rand -base64 32`)
   - `IMAGEKIT_PUBLIC_KEY`
   - `IMAGEKIT_PRIVATE_KEY`
   - `IMAGEKIT_URL_ENDPOINT`
4. Klik **Deploy**.
5. Setelah deploy sukses, jalankan migrasi database sekali saja. Paling gampang dari komputer sendiri:
   ```bash
   DATABASE_URL="isi_url_neon_kamu" npx prisma migrate deploy
   ```
   (atau tinggal jalankan `npx prisma migrate dev` dari langkah 1 di atas sebelum deploy — tabelnya akan langsung ada di database yang sama).

Setelah itu buka `https://nama-project-kamu.vercel.app/admin/login`, login, dan mulai tambah kenangan pertama lewat tombol **"+ Kenangan baru"**.

## Struktur singkat

- `app/page.js` — galeri utama (publik), bisa difilter per tahun.
- `app/post/[id]/page.js` — halaman detail satu kenangan (semua foto + cerita).
- `app/admin` — dashboard, tambah, dan edit kenangan (perlu login).
- `app/api` — API untuk login, logout, CRUD post, dan otorisasi upload ke ImageKit.
- `prisma/schema.prisma` — struktur tabel `Post` (judul, tanggal, cerita) dan `Photo` (bisa lebih dari satu foto per post).

## Kalau mau ganti tema warna

Buka `tailwind.config.js` bagian `colors` — semua warna cream/coklat/terracotta ada di situ, tinggal ganti kode hex-nya.

## Catatan keamanan

- Password admin disimpan sebagai teks biasa di environment variable Vercel (bukan di kode), jadi jangan bagikan `.env` atau screenshot environment variables ke siapapun.
- Selalu akses lewat HTTPS (otomatis kalau di Vercel) supaya login tidak bisa disadap.
