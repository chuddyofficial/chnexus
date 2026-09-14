import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

const STAT_ICONS: Record<string, string> = {
  "New submissions": "✉️",
  "Total submissions": "📥",
  "Active announcements": "📣",
  "Active admins": "🛡️",
};

const QUICK_LINKS = [
  { href: "/admin/submissions", label: "Contact Inbox", icon: "✉️" },
  { href: "/admin/announcements", label: "Announcements", icon: "📣" },
  { href: "/admin/settings", label: "Site Settings", icon: "⚙️" },
];

const SUPERADMIN_QUICK_LINKS = [
  { href: "/admin/admins", label: "Admins", icon: "🛡️" },
  { href: "/admin/audit-log", label: "Audit Log", icon: "🗒️" },
];

export default async function AdminOverviewPage() {
  const currentAdmin = await getCurrentAdmin();
  const isSuperAdmin = currentAdmin?.role === "SUPERADMIN";

  const [
    newSubmissions,
    activeAnnouncements,
    totalSubmissions,
    activeAdmins,
    recentSubmissions,
    recentActivity,
  ] = await Promise.all([
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
    prisma.announcement.count({ where: { active: true } }),
    prisma.contactSubmission.count(),
    isSuperAdmin ? prisma.adminUser.count({ where: { active: true } }) : Promise.resolve(null),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    isSuperAdmin
      ? prisma.auditLog.findMany({
          orderBy: { createdAt: "desc" },
          take: 8,
          include: { admin: { select: { email: true } } },
        })
      : Promise.resolve([]),
  ]);

  const stats = [
    { label: "New submissions", value: newSubmissions },
    { label: "Total submissions", value: totalSubmissions },
    { label: "Active announcements", value: activeAnnouncements },
    ...(activeAdmins !== null
      ? [{ label: "Active admins", value: activeAdmins }]
      : []),
  ];

  const quickLinks = isSuperAdmin
    ? [...QUICK_LINKS, ...SUPERADMIN_QUICK_LINKS]
    : QUICK_LINKS;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="mt-1 text-sm text-muted">
        Welcome back{currentAdmin ? `, ${currentAdmin.email}` : ""}. Here&apos;s
        what&apos;s happening across CH Nexus.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-surface/60 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="text-3xl font-semibold">{stat.value}</div>
              <div className="text-2xl opacity-70">
                {STAT_ICONS[stat.label]}
              </div>
            </div>
            <div className="mt-1 text-sm text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Recent submissions
          </h2>
          <div className="mt-4 space-y-2">
            {recentSubmissions.length === 0 && (
              <p className="rounded-xl border border-border bg-surface/60 p-4 text-sm text-muted">
                No submissions yet.
              </p>
            )}
            {recentSubmissions.map((s) => (
              <Link
                key={s.id}
                href="/admin/submissions"
                className="block rounded-xl border border-border bg-surface/60 p-4 transition-colors hover:border-accent/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {s.name} <span className="text-muted">· {s.email}</span>
                    </div>
                    <p className="mt-1 truncate text-sm text-muted">
                      {s.message}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">
                    {s.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {isSuperAdmin && (
            <div className="mt-10">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                Recent activity
              </h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                {recentActivity.length === 0 ? (
                  <p className="p-4 text-sm text-muted">
                    No activity recorded yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {recentActivity.map((log) => (
                      <li
                        key={log.id}
                        className="flex items-center justify-between gap-3 bg-surface/60 px-4 py-3 text-sm"
                      >
                        <span>
                          <span className="font-medium">{log.action}</span>
                          {log.admin && (
                            <span className="text-muted"> · {log.admin.email}</span>
                          )}
                        </span>
                        <span className="shrink-0 text-xs text-muted">
                          {log.createdAt.toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Link
                href="/admin/audit-log"
                className="mt-3 inline-block text-sm text-accent hover:text-accent-2"
              >
                View full audit log →
              </Link>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Quick links
          </h2>
          <div className="mt-4 space-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 p-4 text-sm font-medium transition-colors hover:border-accent/60"
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
