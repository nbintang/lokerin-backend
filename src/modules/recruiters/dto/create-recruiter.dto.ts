// ../../recruiters/dto/create-recruiter-profile.dto.ts

import { IsString, IsUrl, IsUUID, Length } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateRecruiterProfileDto extends CreateUserDto {
  @IsString()
  @Length(2, 50)
  position: string;

  @IsUrl()
  website: string;

  @IsString()
  @Length(10, 1000)
  about: string;

  @IsUUID()
  companyId: string;
}
