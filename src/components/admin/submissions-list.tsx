"use client";

import { useMemo, useState } from "react";
import { SubmissionRow } from "@/components/admin/submission-row";

type Status = "NEW" | "READ" | "ARCHIVED";

type Submission = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: Status;
  createdAt: string;
};

const STATUS_FILTERS: Array<Status | "ALL"> = ["ALL", "NEW", "READ", "ARCHIVED"];

export function SubmissionsList({ submissions }: { submissions: Submission[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return submissions.filter((s) => {
      if (statusFilter !== "ALL" && s.status !== statusFilter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.message.toLowerCase().includes(q)
      );
    });
  }, [submissions, query, statusFilter]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, or message…"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <div className="flex gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "border-accent text-accent"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        {filtered.length} of {submissions.length} submissions
      </p>

      <div className="mt-4 space-y-3">
        {filtered.length === 0 && (
          <p className="rounded-xl border border-border bg-surface/60 p-4 text-sm text-muted">
            No submissions match your search.
          </p>
        )}
        {filtered.map((submission) => (
          <SubmissionRow key={submission.id} {...submission} />
        ))}
      </div>
    </div>
  );
}
