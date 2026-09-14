import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export default async function AdminOverviewPage() {
  const currentAdmin = await getCurrentAdmin();

  const [newSubmissions, activeAnnouncements, totalSubmissions, activeAdmins] =
    await Promise.all([
      prisma.contactSubmission.count({ where: { status: "NEW" } }),
      prisma.announcement.count({ where: { active: true } }),
      prisma.contactSubmission.count(),
      currentAdmin?.role === "SUPERADMIN"
        ? prisma.adminUser.count({ where: { active: true } })
        : Promise.resolve(null),
    ]);

  const stats = [
    { label: "New submissions", value: newSubmissions },
    { label: "Active announcements", value: activeAnnouncements },
    { label: "Total submissions", value: totalSubmissions },
    ...(activeAdmins !== null
      ? [{ label: "Active admins", value: activeAdmins }]
      : []),
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="mt-1 text-sm text-muted">
        Quick status of the CH Nexus public site.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-surface/60 p-6"
          >
            <div className="text-3xl font-semibold">{stat.value}</div>
            <div className="mt-1 text-sm text-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
