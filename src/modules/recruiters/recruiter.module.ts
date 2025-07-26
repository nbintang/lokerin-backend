import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RecruitersController } from './recruiter.controller';
import { RecruitersService } from './recruiter.service';
import { AccessControlService } from '../auth/shared/access-control.service';

@Module({
  imports: [PrismaModule],
  controllers: [RecruitersController],
  providers: [RecruitersService, AccessControlService],
  exports: [RecruitersService],
})
export class RecruiterModule {}
