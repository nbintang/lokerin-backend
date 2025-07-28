-- DropForeignKey
ALTER TABLE "job_applications" DROP CONSTRAINT "fk_job_applications_job";

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "fk_job_applications_job" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
