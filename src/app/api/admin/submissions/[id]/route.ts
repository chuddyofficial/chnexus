import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { submissionStatusSchema } from "@/lib/validation";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const check = await requireAdmin();
  if ("error" in check) return check.error;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = submissionStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const submission = await prisma.contactSubmission
    .update({ where: { id }, data: { status: parsed.data.status } })
    .catch(() => null);

  if (!submission) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.auditLog.create({
    data: {
      action: "SUBMISSION_STATUS_CHANGED",
      adminUserId: check.admin.id,
      metadata: { submissionId: id, status: parsed.data.status },
    },
  });

  return NextResponse.json({ submission });
}
