"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminRow({
  id,
  email,
  role,
  active,
  totpEnabled,
  createdAt,
  lastLoginAt,
  isSelf,
}: {
  id: string;
  email: string;
  role: string;
  active: boolean;
  totpEnabled: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [mfaReset, setMfaReset] = useState<{
    qrCodeDataUrl: string;
    totpSecret: string;
  } | null>(null);

  async function toggleActive() {
    setBusy(true);
    await fetch(`/api/admin/admins/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
    setBusy(false);
  }

  async function resetMfa() {
    setBusy(true);
    const res = await fetch(`/api/admin/admins/${id}/reset-mfa`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setMfaReset({
        qrCodeDataUrl: data.qrCodeDataUrl,
        totpSecret: data.totpSecret,
      });
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div className="rounded-xl border border-border bg-surface/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-medium">
            {email}
            {isSelf && <span className="text-xs text-muted">(you)</span>}
          </div>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted">
            <span className="rounded-full border border-border px-2 py-0.5">
              {role}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 ${active ? "border-success/40 text-success" : "border-danger/40 text-danger"}`}
            >
              {active ? "Active" : "Deactivated"}
            </span>
            <span className="rounded-full border border-border px-2 py-0.5">
              MFA {totpEnabled ? "enabled" : "disabled"}
            </span>
          </div>
          <div className="mt-2 text-xs text-muted">
            Created {new Date(createdAt).toLocaleDateString()}
            {lastLoginAt &&
              ` · Last login ${new Date(lastLoginAt).toLocaleString()}`}
          </div>
        </div>

        {!isSelf && (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={resetMfa}
              className="rounded-md border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-foreground disabled:opacity-60"
            >
              Reset MFA
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={toggleActive}
              className="rounded-md border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-danger hover:text-danger disabled:opacity-60"
            >
              {active ? "Deactivate" : "Reactivate"}
            </button>
          </div>
        )}
      </div>

      {mfaReset && (
        <div className="mt-4 rounded-lg border border-accent/40 bg-background p-4">
          <p className="text-sm text-muted">
            New MFA secret for {email} — have them scan this now, it will not
            be shown again. Their existing sessions have been signed out.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mfaReset.qrCodeDataUrl}
            alt="TOTP QR code"
            className="mt-3 h-40 w-40 rounded-lg border border-border bg-white p-2"
          />
          <p className="mt-2 font-mono text-xs text-muted">
            Manual entry secret: {mfaReset.totpSecret}
          </p>
          <button
            type="button"
            onClick={() => setMfaReset(null)}
            className="mt-3 rounded-md border border-border px-3 py-1 text-xs transition-colors hover:border-accent"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
