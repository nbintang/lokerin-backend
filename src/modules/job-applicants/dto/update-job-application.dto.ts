import { PartialType } from '@nestjs/swagger';
import { CreateJobApplicationStatusDto } from './create-job-application.dto';

export class UpdateJobApplicationDto extends PartialType(
  CreateJobApplicationStatusDto,
) {}
