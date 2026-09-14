"use client";

import Link from "next/link";
import { useState } from "react";
import { SERVICE_LINKS } from "@/lib/links";
import { NexusMark } from "@/components/logos";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/security", label: "Security" },
  { href: "/hosting", label: "Hosting" },
  { href: "/mabu", label: "MABU" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <NexusMark className="h-8 w-8" />
          <span className="text-base">CH NEXUS</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={SERVICE_LINKS.services}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:border-accent hover:text-foreground"
          >
            Nexus Services
          </a>
          <a
            href={SERVICE_LINKS.hosting}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:border-accent hover:text-foreground"
          >
            Hosting Panel
          </a>
          <a
            href={SERVICE_LINKS.mabu}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-gradient-to-r from-accent to-accent-2 px-3 py-1.5 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-opacity hover:opacity-90"
          >
            MABU
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground md:hidden"
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1">
            <span className="block h-0.5 w-4 bg-foreground" />
            <span className="block h-0.5 w-4 bg-foreground" />
            <span className="block h-0.5 w-4 bg-foreground" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm text-muted">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href={SERVICE_LINKS.services}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border px-3 py-2 text-center text-sm text-foreground/90"
            >
              Nexus Services
            </a>
            <a
              href={SERVICE_LINKS.hosting}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border px-3 py-2 text-center text-sm text-foreground/90"
            >
              Hosting Panel
            </a>
            <a
              href={SERVICE_LINKS.mabu}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-gradient-to-r from-accent to-accent-2 px-3 py-2 text-center text-sm font-medium text-white"
            >
              MABU
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
