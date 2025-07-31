import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class InputAIJobDto {
  @IsOptional()
  @IsUrl({}, { message: 'Resume URL must be a valid URL' })
  @IsString()
  resumeUrl?: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'Min score must be a number' })
  @Min(0.1, { message: 'Min score must be at least 0.1' })
  @Max(1.0, { message: 'Min score must be at most 1.0' })
  minScore?: number = 0.38;
}
