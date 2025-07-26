-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "fk_users_companies";

-- DropForeignKey
ALTER TABLE "job_applications" DROP CONSTRAINT "fk_users_applications";

-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "fk_users_posted_jobs";

-- DropForeignKey
ALTER TABLE "recruiter_profiles" DROP CONSTRAINT "fk_users_recruiter_profile";

-- AddForeignKey
ALTER TABLE "recruiter_profiles" ADD CONSTRAINT "fk_users_recruiter_profile" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_posted_by_fkey" FOREIGN KEY ("posted_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
