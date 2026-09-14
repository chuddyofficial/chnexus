import { NexusMark, MabuMark } from "@/components/logos";

export function NexusBanner() {
  return (
    <div className="bg-grid relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-background px-10 py-16 text-center">
      <div className="glow-accent absolute inset-0" />
      <NexusMark className="relative h-24 w-24" />
      <h2 className="relative mt-6 text-3xl font-bold tracking-widest">
        NEXUS SYSTEMS
      </h2>
      <p className="relative mt-2 text-xs uppercase tracking-[0.3em] text-muted">
        Community Security &amp; Moderation
      </p>
    </div>
  );
}

export function MabuBanner() {
  return (
    <div className="bg-grid relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-background px-10 py-16 text-center">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(53, 217, 217, 0.2), transparent 70%)",
        }}
      />
      <MabuMark className="relative h-24 w-24" />
      <h2 className="relative mt-6 text-3xl font-bold tracking-widest">
        MABU
      </h2>
      <p className="relative mt-2 text-xs uppercase tracking-[0.3em] text-muted">
        Cyber Security Team
      </p>
    </div>
  );
}
