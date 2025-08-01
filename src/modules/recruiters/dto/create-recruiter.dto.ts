import { IsString, IsUrl, IsUUID, Length } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { OmitType } from '@nestjs/mapped-types';

export class CreateRecruiterProfileDto extends OmitType(CreateUserDto, [
  'cvUrl',
]) {
  @IsString()
  @Length(2, 50)
  position: string;


  @IsString()
  @Length(10, 1000)
  about: string;

  @IsUUID()
  companyId: string;
}
