import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryJobDto } from './dto/query-job.dto';
import { JobService } from './job.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enum/user.enum';
import { RoleGuard } from '../auth/guards/role.guard';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiJobService } from './ai-job.service';

@Controller('jobs')
export class JobController {
  constructor(
    private jobService: JobService,
    private aiJobService: AiJobService,
  ) {}

  @Get()
  async findJobs(@Query() query: QueryJobDto) {
    return await this.jobService.findJobs(query);
  }

  @Get(':id')
  async findJobById(@Param('id') id: string) {
    return await this.jobService.findJobById(id);
  }

  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER, UserRole.MEMBER)
  @Post('recommend-jobs')
  @UseInterceptors(FileInterceptor('resume'))
  async recommend(@UploadedFile() file: Express.Multer.File) {
    return this.aiJobService.recommendJobs(file);
  }
}
