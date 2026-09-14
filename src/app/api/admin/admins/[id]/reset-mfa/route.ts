import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/require-admin";
import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const check = await requireSuperAdmin();
  if ("error" in check) return check.error;

  const { id } = await params;
  const totpSecret = generateSecret();

  const admin = await prisma.adminUser
    .update({
      where: { id },
      data: { totpSecret, totpEnabled: true },
    })
    .catch(() => null);

  if (!admin) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.session.deleteMany({ where: { adminUserId: id } });

  await prisma.auditLog.create({
    data: {
      action: "ADMIN_MFA_RESET",
      adminUserId: check.admin.id,
      metadata: { targetAdminId: id },
    },
  });

  const otpauthUrl = generateURI({
    issuer: "CH Nexus Admin",
    label: admin.email,
    secret: totpSecret,
  });
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

  return NextResponse.json({ otpauthUrl, totpSecret, qrCodeDataUrl });
}
