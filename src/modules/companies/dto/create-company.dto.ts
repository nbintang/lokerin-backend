import { Prisma } from '@prisma/client';
import { IsString, IsUrl, Length } from 'class-validator';

export class CreateCompanyDto implements Prisma.CompanyCreateWithoutUserInput {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsString()
  @Length(10, 200)
  description: string;
  @IsUrl()
  logoUrl: string;

  @IsUrl()
  website: string;
}
