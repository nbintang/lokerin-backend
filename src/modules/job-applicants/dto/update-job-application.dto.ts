import { PartialType } from '@nestjs/mapped-types';
import { CreateJobApplicationStatusDto } from './create-job-application.dto';
import { JobApplicationStatus } from '../enum/job-application.enum';
import { IsArray, IsEnum, IsUUID } from 'class-validator';

export class UpdateJobApplicationDto extends PartialType(
  CreateJobApplicationStatusDto,
) {
  @IsEnum(JobApplicationStatus)
  status: JobApplicationStatus;

  @IsArray()
  @IsUUID('all', { each: true })
  applicantIds: string[];

  @IsUUID()
  jobId: string;
}
