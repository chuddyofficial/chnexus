import Link from "next/link";
import { SERVICE_LINKS } from "@/lib/links";
import { NexusMark } from "@/components/logos";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <NexusMark className="h-7 w-7" />
              <span>CH NEXUS</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted">
              One ecosystem. Security, infrastructure, research, and community —
              connected.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground">Ecosystem</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/security" className="hover:text-foreground">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/hosting" className="hover:text-foreground">
                  Hosting
                </Link>
              </li>
              <li>
                <Link href="/mabu" className="hover:text-foreground">
                  MABU
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground">Open</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <a
                  href={SERVICE_LINKS.services}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Nexus Services ↗
                </a>
              </li>
              <li>
                <a
                  href={SERVICE_LINKS.hosting}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Hosting Panel ↗
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Get in touch
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CH Nexus. All rights reserved.</p>
          <Link href="/admin/login" className="hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
