import { Module } from '@nestjs/common';
import { JobApplicantService } from './job-applicant.service';
import { JobApplicantController } from './job-applicant.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AccessControlService } from '../auth/shared/access-control.service';

@Module({
  imports: [PrismaModule],
  controllers: [JobApplicantController],
  providers: [JobApplicantService, AccessControlService],
})
export class JobApplicantModule {}
