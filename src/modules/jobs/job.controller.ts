import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryJobDto } from './dto/query-job.dto';
import { JobService } from './job.service';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiJobService } from './ai-job.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enum/user.enum';
import { CreateJobDto } from './dto/create-job.dto';
import { Request } from 'express';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobs')
export class JobController {
  constructor(
    private jobService: JobService,
    private aiJobService: AiJobService,
  ) {}
  @Roles(UserRole.RECRUITER)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Post()
  async createJob(@Req() req: Request, @Body() data: CreateJobDto) {
    const userId = req.user.sub;
    return await this.jobService.createJob(data, userId);
  }

  @Roles(UserRole.RECRUITER)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Put(':id')
  async updateJob(@Param('id') id: string, @Body() data: UpdateJobDto) {
    return await this.jobService.updateJob(id, data);
  }

  @Get()
  async findJobs(@Query() query: QueryJobDto) {
    return await this.jobService.findJobs(query);
  }

  @Get(':id')
  async findJobById(@Param('id') id: string) {
    return await this.jobService.findJobById(id);
  }

  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Roles(UserRole.MEMBER)
  @Post('recommend-jobs')
  @UseInterceptors(FileInterceptor('resume'))
  async recommend(@UploadedFile() file: Express.Multer.File) {
    return this.aiJobService.recommendJobs(file);
  }

  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return this.jobService.deleteJob(id);
  }
}
