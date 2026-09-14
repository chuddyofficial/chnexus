import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { createMfaChallenge } from "@/lib/mfa-challenge";
import { loginSchema } from "@/lib/validation";
import { rateLimit, hashIp } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = await rateLimit(`login:${ip}`, {
    limit: 10,
    windowSeconds: 60 * 15,
  });
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const admin = await prisma.adminUser.findUnique({ where: { email } });

  const ipHash = hashIp(ip, process.env.IP_HASH_SALT ?? "");

  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    if (admin) {
      await prisma.auditLog.create({
        data: { action: "LOGIN_FAILURE", adminUserId: admin.id, ipHash },
      });
    }
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  if (admin.totpEnabled) {
    await createMfaChallenge(admin.id);
    return NextResponse.json({ mfaRequired: true });
  }

  await createSession(admin.id);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });
  await prisma.auditLog.create({
    data: { action: "LOGIN_SUCCESS", adminUserId: admin.id, ipHash },
  });

  return NextResponse.json({ mfaRequired: false });
}
