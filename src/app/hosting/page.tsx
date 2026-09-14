import type { Metadata } from "next";
import { SERVICE_LINKS } from "@/lib/links";

export const metadata: Metadata = {
  title: "Hosting — CH Nexus",
  description:
    "Nexus Hosting is the private infrastructure and control panel behind the CH Nexus ecosystem.",
};

const POINTS = [
  {
    title: "Private infrastructure",
    description:
      "Dedicated infrastructure built specifically to run and support the Nexus ecosystem.",
  },
  {
    title: "Authenticated access",
    description:
      "The hosting panel is a separate, authenticated system — never embedded into the public site.",
  },
  {
    title: "Built for scale",
    description:
      "Infrastructure designed to grow alongside the services and communities that depend on it.",
  },
];

export default function HostingPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-grid">
        <div className="glow-accent absolute inset-x-0 top-0 h-[400px]" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted">
            ☁️ Nexus Hosting
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
            Private infrastructure for Nexus
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted sm:text-base">
            Nexus Hosting powers the infrastructure behind the CH Nexus
            ecosystem. Access is authenticated and managed through a dedicated
            control panel.
          </p>
          <a
            href={SERVICE_LINKS.hosting}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-opacity hover:opacity-90"
          >
            Open Hosting Panel →
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          {POINTS.map((point) => (
            <div
              key={point.title}
              className="rounded-xl border border-border bg-surface/60 p-6"
            >
              <h3 className="font-semibold">{point.title}</h3>
              <p className="mt-2 text-sm text-muted">{point.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
