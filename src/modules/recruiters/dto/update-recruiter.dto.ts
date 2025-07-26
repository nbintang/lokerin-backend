// src/modules/recruiters/dto/update-recruiter-profile.dto.ts
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateRecruiterProfileDto } from './create-recruiter.dto';

export class UpdateRecruiterProfileDto extends PartialType(
  OmitType(CreateRecruiterProfileDto, [
    'password',
    'email',
    'phone',
    'website',
    'companyId',
  ]),
) {}
