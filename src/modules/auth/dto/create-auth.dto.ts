import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
export class AuthDto {
  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  @MaxLength(20)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password harus mengandung minimal satu huruf besar dan satu angka',
  })
  readonly newPassword: string;
}
