import { prisma } from "@/lib/prisma";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { AnnouncementItem } from "@/components/admin/announcement-item";

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Announcements</h1>
      <p className="mt-1 text-sm text-muted">
        Banners shown at the top of the public site.
      </p>

      <div className="mt-8">
        <AnnouncementForm />
      </div>

      <div className="mt-8 space-y-3">
        {announcements.length === 0 && (
          <p className="text-sm text-muted">No announcements yet.</p>
        )}
        {announcements.map((a) => (
          <AnnouncementItem
            key={a.id}
            id={a.id}
            message={a.message}
            level={a.level}
            active={a.active}
          />
        ))}
      </div>
    </div>
  );
}
