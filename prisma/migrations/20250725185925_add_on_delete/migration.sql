-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "fk_companies_jobs";

-- DropForeignKey
ALTER TABLE "recruiter_profiles" DROP CONSTRAINT "fk_companies_recruiter_profile";

-- AddForeignKey
ALTER TABLE "recruiter_profiles" ADD CONSTRAINT "fk_companies_recruiter_profile" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "fk_companies_jobs" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
