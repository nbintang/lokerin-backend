import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
export class CreateJobDto {
  @IsString()
  @IsNotEmpty({ message: 'Job title is required' })
  @Length(2, 50)
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Job description is required' })
  @Length(10, 1000)
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Job location is required' })
  @Length(2, 50)
  location: string;

  @IsString()
  @IsNotEmpty({ message: 'Job salary range is required' })
  @Matches(/^\d+(?:-\d+)?$/, {
    message:
      'Salary range must be in format "min-max", only digits and a single hyphen',
  })
  salaryRange: string;

  @IsString()
  @IsNotEmpty({ message: 'Job role is required' })
  role: string;
}
