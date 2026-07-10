import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/requireAuth";
import { getImageKit } from "@/lib/imagekit";

export async function GET(_request, { params }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!post) {
    return NextResponse.json({ error: "Post tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PUT(request, { params }) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.eventDate) {
    return NextResponse.json({ error: "Judul dan tanggal wajib diisi." }, { status: 400 });
  }

  const existing = await prisma.post.findUnique({
    where: { id: params.id },
    include: { photos: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Post tidak ditemukan." }, { status: 404 });
  }

  // Determine which existing photos were removed, delete them from ImageKit + DB
  const keptPhotoIds = new Set((body.photos || []).filter((p) => p.id).map((p) => p.id));
  const removedPhotos = existing.photos.filter((p) => !keptPhotoIds.has(p.id));

  if (removedPhotos.length > 0) {
    const imagekit = getImageKit();
    await Promise.allSettled(
      removedPhotos.map((p) => imagekit.deleteFile(p.fileId))
    );
    await prisma.photo.deleteMany({
      where: { id: { in: removedPhotos.map((p) => p.id) } },
    });
  }

  // Add new photos (ones without an id)
  const newPhotos = (body.photos || []).filter((p) => !p.id);

  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      title: body.title,
      caption: body.caption || null,
      eventDate: new Date(body.eventDate),
      locationName: body.locationName || null,
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      photos: {
        create: newPhotos.map((p, index) => ({
          url: p.url,
          fileId: p.fileId,
          order: existing.photos.length + index,
        })),
      },
    },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ post });
}

export async function DELETE(_request, { params }) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const existing = await prisma.post.findUnique({
    where: { id: params.id },
    include: { photos: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Post tidak ditemukan." }, { status: 404 });
  }

  const imagekit = getImageKit();
  await Promise.allSettled(existing.photos.map((p) => imagekit.deleteFile(p.fileId)));

  await prisma.post.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
