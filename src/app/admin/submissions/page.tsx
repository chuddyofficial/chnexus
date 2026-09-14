import { prisma } from "@/lib/prisma";
import { SubmissionRow } from "@/components/admin/submission-row";

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

      <div className="mt-8 space-y-3">
        {submissions.length === 0 && (
          <p className="text-sm text-muted">No submissions yet.</p>
        )}
        {submissions.map((submission) => (
          <SubmissionRow
            key={submission.id}
            id={submission.id}
            name={submission.name}
            email={submission.email}
            message={submission.message}
            status={submission.status}
            createdAt={submission.createdAt.toISOString()}
          />
        ))}
      </div>
    </div>
  );
}
