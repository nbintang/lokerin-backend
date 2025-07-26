import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enum/user.enum';

export class QueryUserDto {
  @ApiPropertyOptional({
    example: '1',
    description: 'Page number for pagination',
  })
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({
    example: '10',
    description: 'Number of items per page',
  })
  @IsOptional()
  limit?: string;

  @ApiPropertyOptional({ example: 'John', description: 'Filter by user name' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'Filter by email',
  })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.RECRUITER,
    description: 'Filter by user role',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
