import {
  Controller,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JobApplicantService } from './job-applicant.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enum/user.enum';
import { RoleGuard } from '../auth/guards/role.guard';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';
import { QueryUserDto } from '../users/dto/query-user.dto';
import { Request } from 'express';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CreateJobApplicationStatusDto } from './dto/create-job-application.dto';
import { QueryJobApplicationDto } from './dto/query-job-application.dto';

@UseGuards(AccessTokenGuard)
@Controller('job-applicants')
export class JobApplicantController {
  constructor(private readonly jobApplicationService: JobApplicantService) {}

  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Get()
  async getApplicants(@Req() request: Request, @Query() query: QueryUserDto) {
    const recruiterId = request.user.sub;
    return await this.jobApplicationService.findApplicants(recruiterId, query);
  }
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Roles(UserRole.MEMBER)
  @Get('applied')
  async getAppliedJobs(
    @Query() query: QueryJobApplicationDto,
    @Req() request: Request,
  ) {
    const user = request.user;
    if (user.role !== UserRole.MEMBER)
      throw new HttpException('You are not a member', HttpStatus.FORBIDDEN);
    return await this.jobApplicationService.findAppliedJobsByUserId(
      user.sub,
      query,
    );
  }
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Roles(UserRole.MEMBER)
  @Get('applied/:id')
  async getAppliedJob(@Req() request: Request, @Param('id') id: string) {
    const user = request.user;
    if (user.role !== UserRole.MEMBER)
      throw new HttpException('You are not a member', HttpStatus.FORBIDDEN);
    return await this.jobApplicationService.findAppliedJobByIdAndUserId(
      id,
      user.sub,
    );
  }
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Get(':id')
  async getApplicantsById(@Param('id') id: string) {
    return await this.jobApplicationService.findApplicantById(id);
  }

  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Put(':id')
  async updateApplicantStatus(
    @Param('id') applicantId: string,
    @Query('jobId') jobId: string,
    @Body() body: CreateJobApplicationStatusDto,
  ) {
    return await this.jobApplicationService.updateApplicantStatusByRecruiter(
      applicantId,
      jobId,
      body.status,
    );
  }
}
