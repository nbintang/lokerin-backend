import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { QueryCompanyDto } from './dto/query-company.dto';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enum/user.enum';
import { RoleGuard } from '../auth/guards/role.guard';
import { Request } from 'express';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    const userId = req.user.sub;
    return await this.companiesService.createCompany(createCompanyDto, userId);
  }

  @Get()
  async findCompanies(@Query() query: QueryCompanyDto) {
    return await this.companiesService.findCompanies(query);
  }

  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER, UserRole.MEMBER)
  @UseGuards(AccessTokenGuard)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.companiesService.findCompaniesById(id);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Patch(':id')
  async updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return await this.companiesService.updateCompanyById(id, updateCompanyDto);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard, EmailVerifiedGuard)
  @Delete(':id')
  async removeCompany(@Param('id') id: string) {
    return await this.companiesService.removeCompany(id);
  }
}
