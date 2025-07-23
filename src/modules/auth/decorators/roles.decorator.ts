import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/users/enum/user.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...args: UserRole[]) => SetMetadata(ROLES_KEY, args);
