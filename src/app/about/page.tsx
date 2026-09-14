import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — CH Nexus",
  description:
    "CH Nexus is a connected technology ecosystem spanning community security, private infrastructure, and cyber security research.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
        About CH Nexus
      </h1>
      <p className="mt-6 text-sm text-muted sm:text-base">
        CH Nexus is a connected technology ecosystem — much larger than a
        single Discord bot. It brings together community security,
        infrastructure, and a dedicated cyber security team under one
        platform.
      </p>
      <p className="mt-4 text-sm text-muted sm:text-base">
        Nexus Services provides the public, community-facing side of the
        ecosystem: moderation, security, and management tools for Discord
        communities. Nexus Hosting powers the private infrastructure behind
        it. MABU is the CH Nexus cyber security team, working to keep the
        entire ecosystem protected.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface/60 p-6">
          <h2 className="font-semibold">Community</h2>
          <p className="mt-2 text-sm text-muted">
            Tools that keep Discord communities safe, organized, and engaged.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface/60 p-6">
          <h2 className="font-semibold">Infrastructure</h2>
          <p className="mt-2 text-sm text-muted">
            Private hosting purpose-built to run the Nexus ecosystem reliably.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface/60 p-6">
          <h2 className="font-semibold">Security</h2>
          <p className="mt-2 text-sm text-muted">
            A dedicated cyber security team protecting the ecosystem behind
            the scenes.
          </p>
        </div>
      </div>
    </div>
  );
}
