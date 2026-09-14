"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Status = "NEW" | "READ" | "ARCHIVED";

const STATUS_STYLES: Record<Status, string> = {
  NEW: "border-accent/40 bg-accent/10 text-accent",
  READ: "border-border bg-surface text-muted",
  ARCHIVED: "border-border bg-surface/40 text-muted",
};

export function SubmissionRow({
  id,
  name,
  email,
  message,
  status,
  createdAt,
}: {
  id: string;
  name: string;
  email: string;
  message: string;
  status: Status;
  createdAt: string;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<Status>(status);
  const [updating, setUpdating] = useState(false);

  async function updateStatus(next: Status) {
    setUpdating(true);
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      setCurrent(next);
      router.refresh();
    }
    setUpdating(false);
  }

  return (
    <div className="rounded-xl border border-border bg-surface/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted">{email}</div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 text-xs ${STATUS_STYLES[current]}`}
          >
            {current}
          </span>
          <span className="text-xs text-muted">
            {new Date(createdAt).toLocaleString()}
          </span>
        </div>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">
        {message}
      </p>
      <div className="mt-4 flex gap-2">
        {(["NEW", "READ", "ARCHIVED"] as const)
          .filter((s) => s !== current)
          .map((s) => (
            <button
              key={s}
              type="button"
              disabled={updating}
              onClick={() => updateStatus(s)}
              className="rounded-md border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-foreground disabled:opacity-60"
            >
              Mark {s.toLowerCase()}
            </button>
          ))}
      </div>
    </div>
  );
}
