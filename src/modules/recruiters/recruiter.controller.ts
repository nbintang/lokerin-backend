import {
  Controller,
  Get,
  UseGuards,
  Query,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { RecruitersService } from './recruiter.service';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { EmailVerifiedGuard } from 'src/modules/auth/guards/email-verified.guard';
import { UserRole } from 'src/modules/users/enum/user.enum';
import { QueryUserDto } from 'src/modules/users/dto/query-user.dto';
import { UpdateRecruiterProfileDto } from './dto/update-recruiter.dto';

@UseGuards(AccessTokenGuard)
@Controller('recruiters')
export class RecruitersController {
  constructor(private readonly recruitersService: RecruitersService) {}

  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Put(':id')
  async updateRecruiter(
    @Param('id') id: string,
    @Body() dto: UpdateRecruiterProfileDto,
  ) {
    return await this.recruitersService.updateRecruiter(id, dto);
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
    return await this.recruitersService.findRecruiterById(id);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(RoleGuard, EmailVerifiedGuard)
  @Delete(':id')
  async deleteRecruiter(@Param('id') id: string) {
    return await this.recruitersService.deleteRecruiter(id);
  }
}
