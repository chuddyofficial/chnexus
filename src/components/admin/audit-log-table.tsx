"use client";

import { useMemo, useState } from "react";

type LogRow = {
  id: string;
  action: string;
  adminEmail: string | null;
  metadata: unknown;
  createdAt: string;
};

const ACTION_STYLES: Record<string, string> = {
  LOGIN_SUCCESS: "border-success/40 text-success",
  LOGIN_FAILURE: "border-danger/40 text-danger",
  LOGOUT: "border-border text-muted",
  ADMIN_DEACTIVATED: "border-warning/40 text-warning",
  ADMIN_MFA_RESET: "border-warning/40 text-warning",
  ADMIN_CREATED: "border-accent/40 text-accent",
};

export function AuditLogTable({ logs }: { logs: LogRow[] }) {
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");

  const actions = useMemo(
    () => ["ALL", ...Array.from(new Set(logs.map((l) => l.action)))],
    [logs],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return logs.filter((log) => {
      if (actionFilter !== "ALL" && log.action !== actionFilter) return false;
      if (!q) return true;
      return (
        log.action.toLowerCase().includes(q) ||
        (log.adminEmail ?? "").toLowerCase().includes(q)
      );
    });
  }, [logs, query, actionFilter]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by action or admin email…"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        >
          {actions.map((a) => (
            <option key={a} value={a}>
              {a === "ALL" ? "All actions" : a}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-xs text-muted">
        {filtered.length} of {logs.length} entries
      </p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/60 text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Admin</th>
              <th className="px-4 py-3 font-medium">Details</th>
              <th className="px-4 py-3 font-medium">When</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${ACTION_STYLES[log.action] ?? "border-border text-muted"}`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{log.adminEmail ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-muted">
                  {log.metadata ? JSON.stringify(log.metadata) : ""}
                </td>
                <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted">
                  No activity matches your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
