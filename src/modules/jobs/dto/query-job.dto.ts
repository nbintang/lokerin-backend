import { IsOptional, IsInt, Min, IsUUID, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { JobApplicationStatus } from '../../job-applicants/enum/job-application.enum';

export class QueryJobDto {
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

  @IsOptional()
  @Type(() => String)
  name?: string;

  @IsUUID()
  @IsOptional()
  companyId: string;

  @IsUUID()
  @IsOptional()
  postedBy: string;

  @IsEnum(JobApplicationStatus)
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  status: string;
}
