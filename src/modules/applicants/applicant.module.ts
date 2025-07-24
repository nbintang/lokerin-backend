import { Module } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { ApplicantsController } from './applicants.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { AiJobService } from './ai-job.service';
import { AccessControlService } from '../auth/shared/access-control.service';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [ApplicantsController],
  providers: [ApplicantsService, AiJobService, AccessControlService],
  exports: [ApplicantsService],
})
export class ApplicantsModule {}
