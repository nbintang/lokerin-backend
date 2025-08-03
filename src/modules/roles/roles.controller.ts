import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { QueryRoleDto } from './dto/query-role.dto';
import { RoleGuard } from '../auth/guards/role.guard';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enum/user.enum';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.createRole(createRoleDto);
  }
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Get('/users')
  async findAllRoleWithUsers(@Query() query: QueryRoleDto) {
    return await this.rolesService.findAllRoleWithUsers(query);
  }

  @Get()
  async findRoles(@Query() query: QueryRoleDto) {
    return await this.rolesService.findAllRoles(query);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Delete(':id')
  async removeRole(@Param('id') id: string) {
    return await this.rolesService.removeRole(id);
  }
}
