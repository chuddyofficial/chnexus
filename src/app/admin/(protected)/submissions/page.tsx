import { prisma } from "@/lib/prisma";
import { SubmissionsList } from "@/components/admin/submissions-list";

export default async function SubmissionsPage() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Contact Inbox</h1>
      <p className="mt-1 text-sm text-muted">
        Messages submitted through the public contact form.
      </p>

      <div className="mt-8">
        <SubmissionsList
          submissions={submissions.map((s) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            message: s.message,
            status: s.status,
            createdAt: s.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
