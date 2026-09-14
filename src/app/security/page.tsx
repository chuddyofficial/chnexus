import type { Metadata } from "next";
import { SERVICE_LINKS } from "@/lib/links";

export const metadata: Metadata = {
  title: "Security — CH Nexus",
  description:
    "Nexus Services brings AutoMod, anti-raid, moderation, verification, tickets, logging, and more to your Discord community.",
};

const FEATURES = [
  {
    title: "AutoMod",
    description:
      "Automatic filtering of spam, scam links, and unwanted content in real time.",
  },
  {
    title: "Anti-Raid",
    description:
      "Detects and mitigates mass-join raids and coordinated attacks before they spread.",
  },
  {
    title: "Moderation",
    description:
      "Warnings, mutes, kicks, and bans with a full case history for every member.",
  },
  {
    title: "Verification",
    description:
      "Gate new members behind configurable verification flows to keep bots and bad actors out.",
  },
  {
    title: "Tickets",
    description:
      "Structured support channels for member requests, reports, and staff follow-up.",
  },
  {
    title: "Logging",
    description:
      "Detailed audit trails for moderation actions, message edits/deletes, and member changes.",
  },
  {
    title: "Leveling",
    description:
      "Activity-based leveling and rewards to encourage engagement in your community.",
  },
  {
    title: "Giveaways",
    description:
      "Run and manage giveaways with configurable entry requirements and winner selection.",
  },
  {
    title: "Suggestions",
    description:
      "A structured suggestion pipeline members can submit to and staff can review.",
  },
  {
    title: "Reaction Roles",
    description:
      "Self-service role assignment through reactions or buttons.",
  },
  {
    title: "Staff Tools",
    description:
      "Purpose-built utilities for moderators and admins to manage the server efficiently.",
  },
  {
    title: "Server Configuration",
    description:
      "A full dashboard to configure every module without touching a single command.",
  },
];

export default function SecurityPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-grid">
        <div className="glow-accent absolute inset-x-0 top-0 h-[400px]" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted">
            🛡️ Nexus Services
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
            Security for your community
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted sm:text-base">
            Nexus Services is the public, community-facing side of CH Nexus —
            a complete moderation and security toolkit for Discord.
          </p>
          <a
            href={SERVICE_LINKS.services}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-opacity hover:opacity-90"
          >
            Open Nexus Services →
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-surface/60 p-6 transition-colors hover:border-accent/60"
            >
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
