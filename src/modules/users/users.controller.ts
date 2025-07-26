import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from './enum/user.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';
import { Request } from 'express';
import { UsersService } from './users.service';
import { QueryUserDto } from './dto/query-user.dto';
@UseGuards(AccessTokenGuard) // Semua endpoint butuh login
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // Get profile diri sendiri
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER, UserRole.MEMBER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Get('me')
  async findProfile(@Req() request: Request) {
    const userId = request.user.sub;
    return await this.usersService.findUserById(userId);
  }

  // Update profile sendiri
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER, UserRole.MEMBER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Patch('me')
  async updateProfile(
    @Req() request: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = request.user.sub;
    return await this.usersService.updateUserById(userId, updateUserDto);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Get()
  async findAllUsers(@Query() query: QueryUserDto) {
    return await this.usersService.findAllUsers(query);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return await this.usersService.findUserById(id);
  }

  // Hapus user by ID — hanya admin
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
