import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AccessControlService } from '../auth/shared/access-control.service';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { AiJobService } from './ai-job.service';
import { JobMemberService } from './job-member.service';
@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [JobController],
  providers: [JobService, AiJobService, JobMemberService, AccessControlService],
})
export class JobModule {}
