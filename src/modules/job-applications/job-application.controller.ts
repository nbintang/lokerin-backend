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
  Post,
  HttpStatus,
} from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enum/user.enum';
import { RoleGuard } from '../auth/guards/role.guard';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';
import { QueryUserDto } from '../users/dto/query-user.dto';
import { Request } from 'express';
import { JobApplicationStatus } from './enum/job-application.enum';

@Controller('job-application')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Get()
  async getApplicants(@Req() req: Request, @Query() query: QueryUserDto) {
    const recruiterId = req.user.sub;
    return await this.jobApplicationService.findApplicants(recruiterId, query);
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
    @Body() body: { status: JobApplicationStatus },
  ) {
    return await this.jobApplicationService.updateApplicantStatusByRecruiter(
      applicantId,
      jobId,
      body.status,
    );
  }
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER, UserRole.MEMBER)
  @Post('apply/:id')
  async apply(@Req() req: Request, @Param('id') id: string) {
    try {
      const user = req.user;
      if (user.role !== UserRole.MEMBER)
        throw new HttpException('You are not a member', HttpStatus.FORBIDDEN);
      const userId = user.sub;
      return await this.jobApplicationService.applyJob(userId, id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
