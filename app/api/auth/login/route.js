import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { prisma } from "@/lib/db";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

export async function POST(request) {
  const ip = getClientIp(request);

  const existingAttempt = await prisma.loginAttempt.findUnique({ where: { ip } });
  if (existingAttempt) {
    const minutesSince = (Date.now() - existingAttempt.lastAttempt.getTime()) / 60000;
    if (minutesSince < WINDOW_MINUTES && existingAttempt.count >= MAX_ATTEMPTS) {
      const waitMinutes = Math.ceil(WINDOW_MINUTES - minutesSince);
      return NextResponse.json(
        { error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${waitMinutes} menit.` },
        { status: 429 }
      );
    }
    if (minutesSince >= WINDOW_MINUTES) {
      await prisma.loginAttempt.update({ where: { ip }, data: { count: 0 } });
    }
  }

  const body = await request.json().catch(() => null);

  if (!body?.username || !body?.password) {
    return NextResponse.json(
      { error: "Username dan password wajib diisi." },
      { status: 400 }
    );
  }

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (body.username !== validUsername || body.password !== validPassword) {
    await prisma.loginAttempt.upsert({
      where: { ip },
      update: { count: { increment: 1 } },
      create: { ip, count: 1 },
    });
    return NextResponse.json(
      { error: "Username atau password salah." },
      { status: 401 }
    );
  }

  await prisma.loginAttempt.deleteMany({ where: { ip } });

  const token = await createSessionToken({ username: validUsername });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
