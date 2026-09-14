import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuditLogTable } from "@/components/admin/audit-log-table";

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

      <div className="mt-8">
        <AuditLogTable
          logs={logs.map((log) => ({
            id: log.id,
            action: log.action,
            adminEmail: log.admin?.email ?? null,
            metadata: log.metadata,
            createdAt: log.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
