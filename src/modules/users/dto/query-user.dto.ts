import { IsOptional } from 'class-validator';
import { UserRole } from '../enum/user.enum';

export class QueryUserDto {
  @IsOptional()
  page: string;

  @IsOptional()
  limit: string;

  @IsOptional()
  name: string;

  @IsOptional()
  email: string;

  @IsOptional()
  role: UserRole.MEMBER | UserRole.RECRUITER;
}
