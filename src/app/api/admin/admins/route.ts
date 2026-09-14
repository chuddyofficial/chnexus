import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/require-admin";
import { hashPassword } from "@/lib/auth";
import { createAdminSchema } from "@/lib/validation";
import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode";

export async function GET() {
  const check = await requireSuperAdmin();
  if ("error" in check) return check.error;

  const admins = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      role: true,
      active: true,
      totpEnabled: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  return NextResponse.json({ admins });
}

export async function POST(req: NextRequest) {
  const check = await requireSuperAdmin();
  if ("error" in check) return check.error;

  const body = await req.json().catch(() => null);
  const parsed = createAdminSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const existing = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return NextResponse.json(
      { error: "An admin with that email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const totpSecret = generateSecret();

  const admin = await prisma.adminUser.create({
    data: {
      email: parsed.data.email,
      role: parsed.data.role,
      passwordHash,
      totpSecret,
      totpEnabled: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "ADMIN_CREATED",
      adminUserId: check.admin.id,
      metadata: { createdAdminId: admin.id, email: admin.email },
    },
  });

  const otpauthUrl = generateURI({
    issuer: "CH Nexus Admin",
    label: admin.email,
    secret: totpSecret,
  });
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

  return NextResponse.json({
    admin: { id: admin.id, email: admin.email, role: admin.role },
    otpauthUrl,
    totpSecret,
    qrCodeDataUrl,
  });
}
