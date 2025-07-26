import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/enum/user.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...args: UserRole[]) => SetMetadata(ROLES_KEY, args);
