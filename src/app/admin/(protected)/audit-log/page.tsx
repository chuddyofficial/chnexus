import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ACTION_STYLES: Record<string, string> = {
  LOGIN_SUCCESS: "border-success/40 text-success",
  LOGIN_FAILURE: "border-danger/40 text-danger",
  LOGOUT: "border-border text-muted",
  ADMIN_DEACTIVATED: "border-warning/40 text-warning",
  ADMIN_MFA_RESET: "border-warning/40 text-warning",
  ADMIN_CREATED: "border-accent/40 text-accent",
};

export default async function AuditLogPage() {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin || currentAdmin.role !== "SUPERADMIN") {
    redirect("/admin");
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { admin: { select: { email: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Audit Log</h1>
      <p className="mt-1 text-sm text-muted">
        The last 200 recorded admin actions.
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border">
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
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${ACTION_STYLES[log.action] ?? "border-border text-muted"}`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {log.admin?.email ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {log.metadata ? JSON.stringify(log.metadata) : ""}
                </td>
                <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                  {log.createdAt.toLocaleString()}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted">
                  No activity recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
