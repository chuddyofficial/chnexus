import Link from "next/link";
import { NexusMark, MabuMark } from "@/components/logos";
import { getServiceLinks, getSiteContent } from "@/lib/site-settings";

const CAPABILITIES = [
  "Community Infrastructure",
  "Security",
  "Private Hosting",
  "Cybersecurity",
  "Administration",
  "Centralized Management",
];

export default async function Home() {
  const links = await getServiceLinks();
  const content = await getSiteContent();

  const pillars = [
    {
      mark: <NexusMark className="h-9 w-9" />,
      title: "Nexus Services",
      description: content.pillarServicesDescription,
      cta: "Open Services",
      href: links.services,
    },
    {
      icon: "☁️",
      title: "Nexus Hosting",
      description: content.pillarHostingDescription,
      cta: "Open Hosting",
      href: links.hosting,
    },
    {
      mark: <MabuMark className="h-9 w-9" />,
      title: "MABU",
      description: content.pillarMabuDescription,
      cta: "Enter MABU",
      href: links.mabu,
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-grid">
        <div className="glow-accent absolute inset-x-0 top-0 h-[600px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <NexusMark className="mx-auto h-20 w-20" />
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted">
              One ecosystem, four capabilities
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              {content.heroTitle}
            </h1>
            <p className="mt-6 text-lg text-muted sm:text-xl">
              {content.heroTagline}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-muted sm:text-base">
              {content.heroDescription}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href={links.services}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-opacity hover:opacity-90"
              >
                Open Nexus Services
              </a>
              <a
                href={links.hosting}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent"
              >
                Hosting Panel
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group flex flex-col rounded-xl border border-border bg-surface/60 p-6 transition-colors hover:border-accent/60"
            >
              <div className="flex h-9 items-center text-3xl">
                {pillar.mark ?? pillar.icon}
              </div>
              <h2 className="mt-4 text-lg font-semibold">{pillar.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted">
                {pillar.description}
              </p>
              <a
                href={pillar.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors group-hover:text-accent-2"
              >
                {pillar.cta} <span aria-hidden>→</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              A connected ecosystem
            </h2>
            <p className="mt-3 text-sm text-muted sm:text-base">
              Every part of CH Nexus is built to work together — from the
              community-facing bot to the private infrastructure and research
              team behind it.
            </p>
          </div>

          <div className="mx-auto mt-12 flex max-w-xl flex-col items-center gap-4">
            <div className="rounded-lg border border-accent/40 bg-surface px-6 py-3 text-sm font-medium">
              CH NEXUS
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="grid w-full gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-surface/60 px-4 py-3 text-center text-sm">
                <div className="font-medium">Nexus Services</div>
                <div className="mt-1 text-xs text-muted">
                  services.chnexus.net
                </div>
              </div>
              <div className="rounded-lg border border-border bg-surface/60 px-4 py-3 text-center text-sm">
                <div className="font-medium">Nexus Hosting</div>
                <div className="mt-1 text-xs text-muted">
                  panel.chnexus.net
                </div>
              </div>
              <div className="rounded-lg border border-border bg-surface/60 px-4 py-3 text-center text-sm">
                <div className="font-medium">MABU</div>
                <div className="mt-1 text-xs text-muted">Private access</div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 flex max-w-3xl flex-wrap justify-center gap-3">
            {CAPABILITIES.map((cap) => (
              <span
                key={cap}
                className="rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs text-muted"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-2 p-10 text-center sm:p-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">
            Invite Nexus to your Discord server or explore what the ecosystem
            can do for your community.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={links.services}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-opacity hover:opacity-90"
            >
              Invite Nexus
            </a>
            <Link
              href="/about"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
