import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { rateLimit, hashIp } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = await rateLimit(`contact:${ip}`, {
    limit: 5,
    windowSeconds: 60 * 60,
  });
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again later." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your input and try again." },
      { status: 400 },
    );
  }

  const ipHash = hashIp(ip, process.env.IP_HASH_SALT ?? "");

  await prisma.contactSubmission.create({
    data: { ...parsed.data, ipHash },
  });

  return NextResponse.json({ success: true });
}
