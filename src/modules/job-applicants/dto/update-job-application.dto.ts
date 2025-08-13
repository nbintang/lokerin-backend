import { PartialType } from '@nestjs/mapped-types';
import { CreateJobApplicationStatusDto } from './create-job-application.dto';
import { JobApplicationStatus } from '../enum/job-application.enum';
import { ArrayNotEmpty, IsArray, IsEnum, IsUUID } from 'class-validator';

export class UpdateSingleApplicantDto {
  @IsEnum(JobApplicationStatus)
  status: JobApplicationStatus;
}
export class UpdateJobBulkApplicationDto extends PartialType(
  CreateJobApplicationStatusDto,
) {
  @IsEnum(JobApplicationStatus)
  status: JobApplicationStatus;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  applicantIds: string[];
}
