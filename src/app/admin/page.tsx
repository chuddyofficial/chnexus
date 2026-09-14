import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [newSubmissions, activeAnnouncements, totalSubmissions] =
    await Promise.all([
      prisma.contactSubmission.count({ where: { status: "NEW" } }),
      prisma.announcement.count({ where: { active: true } }),
      prisma.contactSubmission.count(),
    ]);

  const stats = [
    { label: "New submissions", value: newSubmissions },
    { label: "Active announcements", value: activeAnnouncements },
    { label: "Total submissions", value: totalSubmissions },
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
