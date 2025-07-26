import { IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @Length(2, 50, {
    message: 'Role name must be between 2 and 50 characters',
  })
  name: string;
}
