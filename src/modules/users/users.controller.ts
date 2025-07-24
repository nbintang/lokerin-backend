import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user/create-user.dto';
import { UpdateUserDto } from './dto/user/update-user.dto';
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

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // Get profile diri sendiri
  @Get('me')
  async findMe(@Req() request: Request) {
    const userId = request.user.sub;
    const user = await this.usersService.findUserById(userId);
    return {
      message: `${user.name} fetched successfully`,
      data: user,
    };
  }

  // Update profile sendiri
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER, UserRole.MEMBER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Patch('me')
  updateProfile(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    const userId = request.user.sub;
    return this.usersService.updateUserById(userId, updateUserDto);
  }

  // ADMIN dan RECRUITER bisa lihat semua user
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Get()
  findAllUsers(@Query() query: QueryUserDto) {
    return this.usersService.findAllUsers(query);
  }

  // ADMIN dan RECRUITER bisa akses user by ID
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  // Update user by ID (mungkin dipakai admin)
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Patch(':id')
  updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(id, updateUserDto);
  }

  // Hapus user by ID — hanya admin
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
