import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AccessControlService } from '../auth/shared/access-control.service';
import { JobController } from './job.controller';
import { ApplicantsModule } from '../applicants/applicant.module';
import { ApplicantsService } from '../applicants/applicants.service';
@Module({
  imports: [HttpModule, PrismaModule, ApplicantsModule],
  controllers: [JobController],
  providers: [ApplicantsService, AccessControlService],
})
export class JobModule {}
