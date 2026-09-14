import type { Metadata } from "next";
import { MabuMark } from "@/components/logos";

export const metadata: Metadata = {
  title: "MABU — CH Nexus",
  description: "MABU is the CH Nexus cyber security team.",
};

const AREAS = [
  {
    title: "Threat monitoring",
    description:
      "Keeping watch over the ecosystem for emerging risks before they become incidents.",
  },
  {
    title: "Incident response",
    description:
      "Investigating and responding when something in the ecosystem needs attention.",
  },
  {
    title: "Internal security",
    description:
      "Working behind the scenes to keep Nexus infrastructure and services protected.",
  },
];

export default function MabuPage() {
  return (
    <div className="relative overflow-hidden bg-grid">
      <div
        className="absolute inset-x-0 top-0 h-[400px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(53, 217, 217, 0.2), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <MabuMark className="mx-auto h-20 w-20" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
          MABU
        </h1>
        <p className="mt-4 text-sm text-muted sm:text-base">
          MABU is the CH Nexus cyber security team — working behind the
          scenes to protect the ecosystem.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted sm:text-base">
          From infrastructure to community services, MABU helps keep every
          part of CH Nexus safe, so the rest of the ecosystem can focus on
          serving the community.
        </p>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          {AREAS.map((area) => (
            <div
              key={area.title}
              className="rounded-xl border border-border bg-surface/60 p-6"
            >
              <h3 className="font-semibold">{area.title}</h3>
              <p className="mt-2 text-sm text-muted">{area.description}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-xs text-muted">
          MABU operates internally and does not have public-facing tools or
          services.
        </p>
      </div>
    </div>
  );
}
