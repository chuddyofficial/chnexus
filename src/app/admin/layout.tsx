import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth";
import { NexusMark } from "@/components/logos";
import { LogoutButton } from "@/components/admin/logout-button";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/submissions", label: "Contact Inbox" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/settings", label: "Site Settings" },
];

const SUPERADMIN_NAV = [
  { href: "/admin/admins", label: "Admins" },
  { href: "/admin/audit-log", label: "Audit Log" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const navItems =
    admin.role === "SUPERADMIN" ? [...NAV, ...SUPERADMIN_NAV] : NAV;

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="flex items-center gap-2 px-2">
          <NexusMark className="h-7 w-7" />
          <span className="text-sm font-semibold">Admin</span>
        </div>
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-border px-2 pt-4">
          <p className="truncate text-xs text-muted">{admin.email}</p>
          <LogoutButton />
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
