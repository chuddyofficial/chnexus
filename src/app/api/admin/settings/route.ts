import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { siteSettingSchema } from "@/lib/validation";

export async function GET() {
  const check = await requireAdmin();
  if ("error" in check) return check.error;

  const settings = await prisma.siteSetting.findMany();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const check = await requireAdmin();
  if ("error" in check) return check.error;

  const body = await req.json().catch(() => null);
  const parsed = siteSettingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const setting = await prisma.siteSetting.upsert({
    where: { key: parsed.data.key },
    create: parsed.data,
    update: { value: parsed.data.value },
  });

  await prisma.auditLog.create({
    data: {
      action: "SETTING_UPDATED",
      adminUserId: check.admin.id,
      metadata: { key: parsed.data.key },
    },
  });

  return NextResponse.json({ setting });
}
