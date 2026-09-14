import type { Metadata } from "next";
import { SERVICE_LINKS } from "@/lib/links";
import { MabuMark } from "@/components/logos";

export const metadata: Metadata = {
  title: "MABU — CH Nexus",
  description: "MABU is the CH Nexus cyber security team.",
};

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
      <div className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <MabuMark className="h-20 w-20" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
          MABU
        </h1>
        <p className="mt-4 text-sm text-muted sm:text-base">
          MABU is the CH Nexus cyber security team — working behind the
          scenes to protect the ecosystem.
        </p>
        <p className="mt-2 text-xs text-muted">
          Access is private and restricted to authorized personnel.
        </p>
        <a
          href={SERVICE_LINKS.mabu}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-accent-cyan to-accent px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-opacity hover:opacity-90"
        >
          Sign In →
        </a>
      </div>
    </div>
  );
}
