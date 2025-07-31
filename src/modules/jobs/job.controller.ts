import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
import { JobMemberService } from './job-member.service';
import { InputAIJobDto } from './dto/input-ai-job.dto';

@Controller('jobs')
export class JobController {
  constructor(
    private jobService: JobService,
    private aiJobService: AiJobService,
    private jobMemberService: JobMemberService,
  ) {}
  @Roles(UserRole.RECRUITER)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Post()
  async createJob(@Req() req: Request, @Body() data: CreateJobDto) {
    const userId = req.user.sub;
    return await this.jobService.createJob(data, userId);
  }
  @Roles(UserRole.MEMBER)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Post('apply/:jobId')
  async apply(@Req() req: Request, @Param('jobId') jobId: string) {
    try {
      const user = req.user;
      if (user.role !== UserRole.MEMBER) {
        throw new HttpException('You are not a member', HttpStatus.FORBIDDEN);
      }
      const userId = user.sub;
      return await this.jobMemberService.applyJobApplications(userId, jobId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Roles(UserRole.RECRUITER)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Put(':id')
  async updateJob(@Param('id') id: string, @Body() data: UpdateJobDto) {
    return await this.jobService.updateJob(id, data);
  }

  @Get('public')
  async findJobsForPublic(@Query() query: QueryJobDto) {
    return await this.jobService.findJobs(query);
  }

  @Roles(UserRole.MEMBER)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Get()
  async findJobs(@Query() query: QueryJobDto, @Req() req: Request) {
    const userId = req.user.sub;
    return await this.jobMemberService.findJobs(query, userId);
  }

  @Get('public/:id')
  async findJobForPublicById(@Param('id') id: string) {
    return await this.jobService.findJobById(id);
  }

  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Roles(UserRole.MEMBER)
  @Post('recommend-jobs')
  @UseInterceptors(FileInterceptor('resume'))
  async recommend(
    @UploadedFile() file: Express.Multer.File,
    @Body() input: InputAIJobDto,
    @Req() req: Request,
  ) {
    const userId = req.user.sub;
    return this.aiJobService.recommendJobs(
      file,
      {
        resumeUrl: input.resumeUrl,
        minScore: input.minScore,
      },
      userId,
    );
  }

  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return this.jobService.deleteJob(id);
  }
}
