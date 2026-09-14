-- AlterEnum
ALTER TYPE "SubmissionStatus" ADD VALUE 'REPLIED';

-- AlterEnum
ALTER TYPE "AuditAction" ADD VALUE 'SUBMISSION_REPLIED';

-- CreateEnum
CREATE TYPE "ReplyStatus" AS ENUM ('SENT', 'FAILED');

-- CreateTable
CREATE TABLE "SubmissionReply" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "adminUserId" TEXT,
    "message" TEXT NOT NULL,
    "status" "ReplyStatus" NOT NULL DEFAULT 'SENT',
    "resendMessageId" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubmissionReply_submissionId_idx" ON "SubmissionReply"("submissionId");

-- AddForeignKey
ALTER TABLE "SubmissionReply" ADD CONSTRAINT "SubmissionReply_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ContactSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionReply" ADD CONSTRAINT "SubmissionReply_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
