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
  Res,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from './enum/user.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';
import { Request, Response } from 'express';
@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findMe(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const userId = request.user.sub;
    const user = await this.usersService.findUserById(userId);
    return {
      message: `${user.name} fetched successfully`,
      data: user,
    };
  }

  @Get()
  findAllUsers(@Query() query: QueryUserDto) {
    return this.usersService.findAllUsers(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER, UserRole.MEMBER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserById(id, updateUserDto);
  }
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
