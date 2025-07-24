import {
  Controller,
  Get,
  UseGuards,
  Req,
  Query,
  Body,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { RecruitersService } from './recruiter.service';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { EmailVerifiedGuard } from 'src/modules/auth/guards/email-verified.guard';
import { UserRole } from 'src/modules/users/enum/user.enum';
import { QueryUserDto } from 'src/modules/users/dto/query-user.dto';
import { JobApplicationStatus } from '../job/enum/job.enum';
import { Request } from 'express';

@UseGuards(AccessTokenGuard)
@Controller('recruiters')
export class RecruitersController {
  constructor(private readonly recruitersService: RecruitersService) {}
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @Get('applicants')
  async getApplicants(@Req() req: Request, @Query() query: QueryUserDto) {
    const recruiterId = req.user.sub;
    return await this.recruitersService.findApplicantsByRecruiter(
      recruiterId,
      query,
    );
  }
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @Put('applicants/:applicantId')
  async updateApplicantStatus(
    @Param('applicantId') applicantId: string,
    @Query('jobId') jobId: string,
    @Body() body: { status: JobApplicationStatus },
  ) {
    return await this.recruitersService.updateApplicantStatusByRecruiter(
      applicantId,
      jobId,
      body.status,
    );
  }
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @Get('applicants/:applicantId')
  async getApplicantsByApplicantId(@Param('applicantId') applicantId: string) {
    return await this.recruitersService.findApplicantByApplicantId(applicantId);
  }
}
