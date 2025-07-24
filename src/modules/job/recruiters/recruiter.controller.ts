import {
  Controller,
  Get,
  UseGuards,
  Req,
  Query,
  Body,
  Param,
} from '@nestjs/common';
import { RecruitersService } from './recruiter.service';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { EmailVerifiedGuard } from 'src/modules/auth/guards/email-verified.guard';
import { UserRole } from 'src/modules/users/enum/user.enum';
import { QueryUserDto } from 'src/modules/users/dto/query-user.dto';
import { JobApplicationStatus } from '../enum/job.enum';

@UseGuards(AccessTokenGuard)
@UseGuards(RoleGuard, EmailVerifiedGuard)
@Roles(UserRole.RECRUITER)
@Controller('recruiters')
export class RecruitersController {
  constructor(private readonly recruitersService: RecruitersService) {}

  @Get('applicants')
  async getApplicants(@Req() req, @Query() query: QueryUserDto) {
    const recruiterId = req.user.id; // diasumsikan JWT payload memuat `id`
    return await this.recruitersService.findApplicantsByRecruiter(
      recruiterId,
      query,
    );
  }
  @Get('applicants/:userId')
  async updateApplicantStatus(
    @Param('userId') userId: string,
    @Query('jobId') jobId: string,
    @Body() body: { status: JobApplicationStatus },
  ) {
    return await this.recruitersService.updateApplicantStatusByRecruiter(
      userId,
      jobId,
      body.status,
    );
  }
}
