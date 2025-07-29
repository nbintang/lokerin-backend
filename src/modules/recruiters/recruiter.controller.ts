import {
  Controller,
  Get,
  UseGuards,
  Query,
  Body,
  Param,
  Delete,
  Req,
  Patch,
} from '@nestjs/common';
import { RecruitersService } from './recruiter.service';
import { AccessTokenGuard } from '../../modules/auth/guards/access-token.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleGuard } from '../../modules/auth/guards/role.guard';
import { EmailVerifiedGuard } from '../../modules/auth/guards/email-verified.guard';
import { UserRole } from '../../modules/users/enum/user.enum';
import { QueryUserDto } from '../../modules/users/dto/query-user.dto';
import { UpdateRecruiterProfileDto } from './dto/update-recruiter.dto';
import { Request } from 'express';

@UseGuards(AccessTokenGuard)
@Controller('recruiters')
export class RecruitersController {
  constructor(private readonly recruitersService: RecruitersService) {}
  @Roles(UserRole.RECRUITER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @UseGuards(EmailVerifiedGuard)
  @Get('profile')
  async getRecruiterProfile(@Req() req: Request) {
    const userId = req.user.sub;
    return await this.recruitersService.findRecruiterByUserId(userId);
  }

  @Roles(UserRole.RECRUITER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Patch('profile')
  async updateRecruiterProfile(
    @Req() req: Request,
    @Body() dto: UpdateRecruiterProfileDto,
  ) {
    const userId = req.user.sub;
    return await this.recruitersService.updateRecruiterByUserId(userId, dto);
  }

  // as Admin
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Get()
  async getRecruiters(@Query() query: QueryUserDto) {
    return await this.recruitersService.findRecruiters(query);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Get(':id')
  async getRecruiterById(@Param('id') id: string) {
    return await this.recruitersService.findRecruiterByUserId(id);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Delete(':id')
  async deleteRecruiter(@Param('id') id: string) {
    return await this.recruitersService.deleteRecruiter(id);
  }
}
