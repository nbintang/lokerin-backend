// src/modules/recruiters/dto/update-recruiter-profile.dto.ts
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateRecruiterProfileDto } from './create-recruiter.dto';
import { IsOptional, Length } from 'class-validator';

export class UpdateRecruiterProfileDto extends PartialType(
  OmitType(CreateRecruiterProfileDto, ['password', 'email', 'phone']),
) {
  @IsOptional()
  @Length(2, 50)
  position: string;

  @IsOptional()
  @Length(10, 1000)
  about: string;
}
