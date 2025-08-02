import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { JobApplicationStatus } from '../enum/job-application.enum';
import { Transform, Type } from 'class-transformer';

export class QueryJobApplicationDto {
  @IsEnum(JobApplicationStatus)
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  status: string;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsUUID()
  @IsOptional()
  jobId: string;

  @IsUUID()
  @IsOptional()
  recruiterId: string;

  @IsString()
  @IsOptional()
  name: string;
}
