import { IsEnum } from 'class-validator';
import { JobApplicationStatus } from '../enum/job-application.enum';

export class CreateJobApplicationStatusDto {
  @IsEnum(JobApplicationStatus)
  status: JobApplicationStatus;
}
