"use client";

import { useState } from "react";
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

export function AdminMobileNav({
  email,
  role,
}: {
  email: string;
  role: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navItems = role === "SUPERADMIN" ? [...NAV, ...SUPERADMIN_NAV] : NAV;

  return (
    <div className="border-b border-border bg-surface/40 md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <NexusMark className="h-6 w-6" />
          <span className="text-sm font-semibold">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground"
          aria-label="Toggle admin menu"
        >
          <div className="space-y-1">
            <span className="block h-0.5 w-4 bg-foreground" />
            <span className="block h-0.5 w-4 bg-foreground" />
            <span className="block h-0.5 w-4 bg-foreground" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-4 py-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm ${
                    active ? "bg-accent/10 text-accent" : "text-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 border-t border-border pt-3">
            <p className="truncate text-xs font-medium">{email}</p>
            <span className="mt-1 inline-block rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
              {role}
            </span>
            <div className="mt-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
