import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTotp, createSession } from "@/lib/auth";
import { readMfaChallenge, clearMfaChallenge } from "@/lib/mfa-challenge";
import { mfaVerifySchema } from "@/lib/validation";
import { rateLimit, hashIp } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = await rateLimit(`mfa:${ip}`, {
    limit: 10,
    windowSeconds: 60 * 15,
  });
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  const adminUserId = await readMfaChallenge();
  if (!adminUserId) {
    return NextResponse.json(
      { error: "MFA challenge expired. Please log in again." },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = mfaVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid code." }, { status: 400 });
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: adminUserId } });
  if (!admin || !admin.totpSecret) {
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  }

  const ipHash = hashIp(ip, process.env.IP_HASH_SALT ?? "");

  if (!verifyTotp(admin.totpSecret, parsed.data.code)) {
    await prisma.auditLog.create({
      data: { action: "LOGIN_FAILURE", adminUserId: admin.id, ipHash },
    });
    return NextResponse.json({ error: "Invalid code." }, { status: 401 });
  }

  await clearMfaChallenge();
  await createSession(admin.id);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });
  await prisma.auditLog.create({
    data: { action: "LOGIN_SUCCESS", adminUserId: admin.id, ipHash },
  });

  return NextResponse.json({ success: true });
}
