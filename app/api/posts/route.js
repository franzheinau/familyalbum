import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  const where = year
    ? {
        eventDate: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lt: new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`),
        },
      }
    : {};

  const posts = await prisma.post.findMany({
    where,
    orderBy: { eventDate: "desc" },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ posts });
}

export async function POST(request) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body?.title || !body?.eventDate || !Array.isArray(body?.photos) || body.photos.length === 0) {
    return NextResponse.json(
      { error: "Judul, tanggal, dan minimal satu foto wajib diisi." },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      title: body.title,
      caption: body.caption || null,
      eventDate: new Date(body.eventDate),
      locationName: body.locationName || null,
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      photos: {
        create: body.photos.map((p, index) => ({
          url: p.url,
          fileId: p.fileId,
          order: index,
        })),
      },
    },
    include: { photos: true },
  });

  return NextResponse.json({ post }, { status: 201 });
}
