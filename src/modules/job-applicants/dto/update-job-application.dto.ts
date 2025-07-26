import { PartialType } from '@nestjs/mapped-types';
import { CreateJobApplicationStatusDto } from './create-job-application.dto';

export class UpdateJobApplicationDto extends PartialType(
  CreateJobApplicationStatusDto,
) {}
