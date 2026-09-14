import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/require-admin";
import { z } from "zod";

const patchSchema = z.object({
  active: z.boolean(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const check = await requireSuperAdmin();
  if ("error" in check) return check.error;

  const { id } = await params;

  if (id === check.admin.id) {
    return NextResponse.json(
      { error: "You cannot deactivate your own account." },
      { status: 400 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const admin = await prisma.adminUser
    .update({ where: { id }, data: { active: parsed.data.active } })
    .catch(() => null);

  if (!admin) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (!parsed.data.active) {
    await prisma.session.deleteMany({ where: { adminUserId: id } });
  }

  await prisma.auditLog.create({
    data: {
      action: "ADMIN_DEACTIVATED",
      adminUserId: check.admin.id,
      metadata: { targetAdminId: id, active: parsed.data.active },
    },
  });

  return NextResponse.json({
    admin: { id: admin.id, active: admin.active },
  });
}
