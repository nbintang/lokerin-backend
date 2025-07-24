/*
  Warnings:

  - The values [INTERVIEW] on the enum `application_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "application_status_new" AS ENUM ('APPLIED', 'REVIEWED', 'REJECTED', 'ACCEPTED');
ALTER TABLE "job_applications" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "job_applications" ALTER COLUMN "status" TYPE "application_status_new" USING ("status"::text::"application_status_new");
ALTER TYPE "application_status" RENAME TO "application_status_old";
ALTER TYPE "application_status_new" RENAME TO "application_status";
DROP TYPE "application_status_old";
ALTER TABLE "job_applications" ALTER COLUMN "status" SET DEFAULT 'APPLIED';
COMMIT;
