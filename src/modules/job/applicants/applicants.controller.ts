import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApplicantsService } from './applicants.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { AiJobService } from './ai-job.service';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { Request } from 'express';
import { UserRole } from 'src/modules/users/enum/user.enum';

@UseGuards(AccessTokenGuard)
@Controller('applicants')
export class ApplicantsController {
  constructor(
    private readonly jobService: ApplicantsService,
    private readonly aiJobService: AiJobService,
  ) {}

  @Post('recommend-jobs')
  @UseInterceptors(FileInterceptor('resume'))
  async recommend(@UploadedFile() file: Express.Multer.File) {
    return this.aiJobService.recommendJobs(file);
  }
  @Post('apply/:jobId')
  async apply(@Req() req: Request, @Param('jobId') jobId: string) {
    try {
      const user = req.user;
      if (user.role !== UserRole.MEMBER)
        throw new HttpException('You are not a member', HttpStatus.FORBIDDEN);
      const userId = user.sub;
      return await this.jobService.applyJob(userId, jobId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
