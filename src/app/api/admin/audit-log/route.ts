import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/require-admin";

export async function GET() {
  const check = await requireSuperAdmin();
  if ("error" in check) return check.error;

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { admin: { select: { email: true } } },
  });

  return NextResponse.json({ logs });
}
