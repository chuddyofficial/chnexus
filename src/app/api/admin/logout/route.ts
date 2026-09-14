import { NextResponse } from "next/server";
import { getCurrentAdmin, destroySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const admin = await getCurrentAdmin();
  await destroySession();

  if (admin) {
    await prisma.auditLog.create({
      data: { action: "LOGOUT", adminUserId: admin.id },
    });
  }

  return NextResponse.json({ success: true });
}
