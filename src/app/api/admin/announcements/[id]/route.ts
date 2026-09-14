import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { announcementSchema } from "@/lib/validation";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const check = await requireAdmin();
  if ("error" in check) return check.error;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = announcementSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const announcement = await prisma.announcement
    .update({ where: { id }, data: parsed.data })
    .catch(() => null);

  if (!announcement) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.auditLog.create({
    data: {
      action: "ANNOUNCEMENT_UPDATED",
      adminUserId: check.admin.id,
      metadata: { announcementId: id },
    },
  });

  return NextResponse.json({ announcement });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const check = await requireAdmin();
  if ("error" in check) return check.error;

  const { id } = await params;
  await prisma.announcement.delete({ where: { id } }).catch(() => null);

  await prisma.auditLog.create({
    data: {
      action: "ANNOUNCEMENT_DELETED",
      adminUserId: check.admin.id,
      metadata: { announcementId: id },
    },
  });

  return NextResponse.json({ success: true });
}
