import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { submissionReplySchema } from "@/lib/validation";
import { sendSubmissionReply } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const check = await requireAdmin();
  if ("error" in check) return check.error;

  const { id } = await params;
  const replies = await prisma.submissionReply.findMany({
    where: { submissionId: id },
    orderBy: { createdAt: "asc" },
    include: { admin: { select: { email: true } } },
  });

  return NextResponse.json({ replies });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const check = await requireAdmin();
  if ("error" in check) return check.error;

  const limited = await rateLimit(`reply:${check.admin.id}`, {
    limit: 30,
    windowSeconds: 60 * 60,
  });
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many replies sent. Try again later." },
      { status: 429 },
    );
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = submissionReplySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const submission = await prisma.contactSubmission.findUnique({
    where: { id },
  });
  if (!submission) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const result = await sendSubmissionReply({
    to: submission.email,
    recipientName: submission.name,
    originalMessage: submission.message,
    replyMessage: parsed.data.message,
  });

  const reply = await prisma.submissionReply.create({
    data: {
      submissionId: id,
      adminUserId: check.admin.id,
      message: parsed.data.message,
      status: result.success ? "SENT" : "FAILED",
      resendMessageId: result.success ? result.messageId : null,
      errorMessage: result.success ? null : result.error,
    },
  });

  if (result.success) {
    await prisma.contactSubmission.update({
      where: { id },
      data: { status: "REPLIED" },
    });
  }

  await prisma.auditLog.create({
    data: {
      action: "SUBMISSION_REPLIED",
      adminUserId: check.admin.id,
      metadata: {
        submissionId: id,
        replyId: reply.id,
        success: result.success,
      },
    },
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error, reply },
      { status: 502 },
    );
  }

  return NextResponse.json({ reply });
}
