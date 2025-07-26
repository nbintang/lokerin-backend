import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
export class CreateUserDto implements Prisma.UserCreateInput {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  readonly name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Email tidak valid' })
  readonly email: string;

  @ApiProperty({ example: 'supersecret123' })
  @IsString()
  @Length(10, 15, { message: 'Nomor telepon harus 10-15 digit' })
  readonly phone: string;

  @ApiProperty({ example: '08123456789' })
  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  @MaxLength(20)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password harus mengandung minimal satu huruf besar dan satu angka',
  })
  readonly password: string;
  @ApiProperty({ example: 'MEMBER', enum: ['MEMBER', 'RECRUITER'] })
  @IsOptional()
  @IsUrl({}, { message: 'avatarUrl harus berupa URL yang valid' })
  readonly avatarUrl?: string;
}
