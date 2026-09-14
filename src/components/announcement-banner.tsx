import { prisma } from "@/lib/prisma";

const LEVEL_STYLES: Record<string, string> = {
  INFO: "border-accent/40 bg-accent/10 text-foreground",
  WARNING: "border-warning/40 bg-warning/10 text-foreground",
  CRITICAL: "border-danger/40 bg-danger/10 text-foreground",
};

export async function AnnouncementBanner() {
  const announcement = await prisma.announcement.findFirst({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  if (!announcement) return null;

  return (
    <div
      className={`border-b px-4 py-2 text-center text-sm ${LEVEL_STYLES[announcement.level] ?? LEVEL_STYLES.INFO}`}
    >
      {announcement.message}
    </div>
  );
}
