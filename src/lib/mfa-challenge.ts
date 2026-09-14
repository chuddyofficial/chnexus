import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const MFA_CHALLENGE_COOKIE = "chnexus_mfa_challenge";
const CHALLENGE_TTL_MS = 1000 * 60 * 5; // 5 minutes

function sign(payload: string): string {
  const secret = process.env.AUTH_SECRET ?? "";
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Short-lived, signed cookie proving "this browser already passed the
 * password check for adminUserId" — used only to bridge the password step
 * and the TOTP step of login. Never grants access on its own.
 */
export async function createMfaChallenge(adminUserId: string) {
  const expires = Date.now() + CHALLENGE_TTL_MS;
  const payload = `${adminUserId}.${expires}`;
  const signature = sign(payload);
  const value = `${payload}.${signature}`;

  const cookieStore = await cookies();
  cookieStore.set(MFA_CHALLENGE_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CHALLENGE_TTL_MS / 1000,
  });
}

export async function readMfaChallenge(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(MFA_CHALLENGE_COOKIE)?.value;
  if (!value) return null;

  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [adminUserId, expiresStr, signature] = parts;
  const payload = `${adminUserId}.${expiresStr}`;
  const expected = sign(payload);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || expires < Date.now()) return null;

  return adminUserId;
}

export async function clearMfaChallenge() {
  const cookieStore = await cookies();
  cookieStore.delete(MFA_CHALLENGE_COOKIE);
}
