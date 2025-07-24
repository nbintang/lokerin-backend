// src/modules/recruiters/dto/update-recruiter-profile.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateRecruiterProfileDto } from './create-recruiter.dto';

export class UpdateRecruiterProfileDto extends PartialType(
  CreateRecruiterProfileDto,
) {}
