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

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  readonly name: string;

  @IsEmail({}, { message: 'Email tidak valid' })
  readonly email: string;

  @IsString()
  @Length(10, 15, { message: 'Nomor telepon harus 10-15 digit' })
  readonly phone: string;

  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  @MaxLength(20)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password harus mengandung minimal satu huruf besar dan satu angka',
  })
  readonly password: string;

  @IsOptional()
  @IsUrl({}, { message: 'avatarUrl harus berupa URL yang valid' })
  readonly avatarUrl?: string;
}
