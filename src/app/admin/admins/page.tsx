import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateAdminForm } from "@/components/admin/create-admin-form";
import { AdminRow } from "@/components/admin/admin-row";

export default async function AdminsPage() {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin || currentAdmin.role !== "SUPERADMIN") {
    redirect("/admin");
  }

  const admins = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      role: true,
      active: true,
      totpEnabled: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Admins</h1>
      <p className="mt-1 text-sm text-muted">
        Manage who has access to this dashboard. Only superadmins can see this
        page.
      </p>

      <div className="mt-8">
        <CreateAdminForm />
      </div>

      <div className="mt-8 space-y-3">
        {admins.map((a) => (
          <AdminRow
            key={a.id}
            id={a.id}
            email={a.email}
            role={a.role}
            active={a.active}
            totpEnabled={a.totpEnabled}
            createdAt={a.createdAt.toISOString()}
            lastLoginAt={a.lastLoginAt?.toISOString() ?? null}
            isSelf={a.id === currentAdmin.id}
          />
        ))}
      </div>
    </div>
  );
}
