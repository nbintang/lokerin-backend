import { Module } from '@nestjs/common';
import { ApplicantsService } from './applicants/applicants.service';
import { ApplicantsController } from './applicants/applicants.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AiJobService } from './applicants/ai-job.service';
import { RecruitersService } from './recruiters/recruiter.service';
import { RecruitersController } from './recruiters/recruiter.controller';
import { AccessControlService } from '../auth/shared/access-control.service';
import { JobController } from './job.controller';
@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [ApplicantsController, RecruitersController, JobController],
  providers: [
    ApplicantsService,
    AiJobService,
    RecruitersService,
    AccessControlService,
  ],
  exports: [ApplicantsService, RecruitersService],
})
export class JobModule {}
