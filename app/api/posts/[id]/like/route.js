import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(_request, { params }) {
  try {
    const post = await prisma.post.update({
      where: { id: params.id },
      data: { likes: { increment: 1 } },
      select: { likes: true },
    });
    return NextResponse.json({ likes: post.likes });
  } catch (err) {
    return NextResponse.json({ error: "Post tidak ditemukan." }, { status: 404 });
  }
}
