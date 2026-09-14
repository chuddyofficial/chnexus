"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NexusMark } from "@/components/logos";
import { LogoutButton } from "@/components/admin/logout-button";
import {
  ChartIcon,
  InboxIcon,
  MegaphoneIcon,
  SettingsIcon,
  ShieldIcon,
  LogIcon,
} from "@/components/admin/icons";

const NAV = [
  { href: "/admin", label: "Overview", icon: ChartIcon },
  { href: "/admin/submissions", label: "Contact Inbox", icon: InboxIcon },
  { href: "/admin/announcements", label: "Announcements", icon: MegaphoneIcon },
  { href: "/admin/settings", label: "Site Settings", icon: SettingsIcon },
];

const SUPERADMIN_NAV = [
  { href: "/admin/admins", label: "Admins", icon: ShieldIcon },
  { href: "/admin/audit-log", label: "Audit Log", icon: LogIcon },
];

export function AdminSidebar({
  email,
  role,
}: {
  email: string;
  role: string;
}) {
  const pathname = usePathname();
  const navItems = role === "SUPERADMIN" ? [...NAV, ...SUPERADMIN_NAV] : NAV;

  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <Link href="/admin" className="flex items-center gap-2 px-2">
        <NexusMark className="h-7 w-7" />
        <span className="text-sm font-semibold">Admin</span>
      </Link>
      <nav className="mt-6 space-y-1">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-surface hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 border-t border-border px-2 pt-4">
        <p className="truncate text-xs font-medium">{email}</p>
        <span className="mt-1 inline-block rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
          {role}
        </span>
        <div className="mt-2">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
