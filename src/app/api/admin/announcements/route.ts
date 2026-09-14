import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { announcementSchema } from "@/lib/validation";

export async function GET() {
  const check = await requireAdmin();
  if ("error" in check) return check.error;

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ announcements });
}

export async function POST(req: NextRequest) {
  const check = await requireAdmin();
  if ("error" in check) return check.error;

  const body = await req.json().catch(() => null);
  const parsed = announcementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const announcement = await prisma.announcement.create({
    data: parsed.data,
  });

  await prisma.auditLog.create({
    data: {
      action: "ANNOUNCEMENT_CREATED",
      adminUserId: check.admin.id,
      metadata: { announcementId: announcement.id },
    },
  });

  return NextResponse.json({ announcement });
}
