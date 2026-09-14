import "server-only";
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import type { AdminUser } from "@prisma/client";

export async function requireAdmin(): Promise<
  { admin: AdminUser } | { error: NextResponse }
> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return {
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }
  return { admin };
}
