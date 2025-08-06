import {
  Controller,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  HttpException,
  HttpStatus,
  Delete,
  Patch,
} from '@nestjs/common';
import { JobApplicantService } from './job-applicant.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enum/user.enum';
import { RoleGuard } from '../auth/guards/role.guard';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';
import { Request } from 'express';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { QueryJobApplicationDto } from './dto/query-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';

@UseGuards(AccessTokenGuard)
@Controller('job-applicants')
export class JobApplicantController {
  constructor(private readonly jobApplicationService: JobApplicantService) {}

  @Roles(UserRole.RECRUITER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Get('applicants')
  async getApplicantsByRecruiter(
    @Req() request: Request,
    @Query() query: QueryJobApplicationDto,
  ) {
    const recruiterId = request.user.sub;
    return await this.jobApplicationService.findApplicantsApplied(
      recruiterId,
      query,
    );
  }
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Get()
  async getApplicants(@Query() query: QueryJobApplicationDto) {
    return await this.jobApplicationService.findApplicants(query);
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
  async getAppliedJob(
    @Req() request: Request,
    @Param('id') id: string,
    @Query() query: QueryJobApplicationDto,
  ) {
    const user = request.user;
    if (user.role !== UserRole.MEMBER)
      throw new HttpException('You are not a member', HttpStatus.FORBIDDEN);
    return await this.jobApplicationService.findAppliedJobByIdAndUserId(
      id,
      user.sub,
      query,
    );
  }
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Get('applicants/:id')
  async getApplicantsById(@Param('id') id: string) {
    return await this.jobApplicationService.findApplicantById(id);
  }

  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Patch('applicants/:id')
  async updateApplicantStatus(
    @Param('id') applicantId: string,
    @Query('jobId') jobId: string,
    @Body() body: UpdateJobApplicationDto,
  ) {
    return await this.jobApplicationService.updateApplicantStatusByRecruiter(
      applicantId,
      jobId,
      body.status,
    );
  }
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Patch('applicants')
  async updateApplicantStatusBulk(
    @Query('jobId') jobId: string,
    @Body() body: UpdateJobApplicationDto,
  ) {
    return await this.jobApplicationService.updateApplicantStatusBulkByRecruiter(
      jobId,
      body,
    );
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Delete('applicants/:id')
  async deleteApplicantById(@Param('id') id: string) {
    return await this.jobApplicationService.deleteApplicantById(id);
  }
}
