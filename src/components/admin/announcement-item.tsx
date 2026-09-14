"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LEVEL_STYLES: Record<string, string> = {
  INFO: "border-accent/40 text-accent",
  WARNING: "border-warning/40 text-warning",
  CRITICAL: "border-danger/40 text-danger",
};

export function AnnouncementItem({
  id,
  message,
  level,
  active,
}: {
  id: string;
  message: string;
  level: string;
  active: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggleActive() {
    setBusy(true);
    await fetch(`/api/admin/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
    setBusy(false);
  }

  async function remove() {
    setBusy(true);
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface/60 p-4">
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full border px-2 py-0.5 text-xs ${LEVEL_STYLES[level] ?? LEVEL_STYLES.INFO}`}
        >
          {level}
        </span>
        <span className="text-sm">{message}</span>
        {!active && (
          <span className="text-xs text-muted">(inactive)</span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={toggleActive}
          className="rounded-md border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-foreground disabled:opacity-60"
        >
          {active ? "Deactivate" : "Activate"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={remove}
          className="rounded-md border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-danger hover:text-danger disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
