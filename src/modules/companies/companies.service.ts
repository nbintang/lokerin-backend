import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryCompanyDto } from './dto/query-company.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}
  async createCompany(dto: CreateCompanyDto, userId) {
    const company = await this.prisma.company.create({
      data: {
        name: dto.name,
        description: dto.description,
        logoUrl: dto.logoUrl,
        website: dto.website,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return company;
  }

  async findCompanies(query: QueryCompanyDto) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Prisma.CompanyWhereInput = {
      ...(query.name && {
        name: { contains: query.name, mode: 'insensitive' },
      }),
    };
    const companies = await this.prisma.company.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const companiesCount = await this.prisma.company.count({ where });
    return {
      companies,
      page,
      limit,
      total: companiesCount,
    };
  }

  async findCompaniesById(id: string) {
    const companies = await this.prisma.company.findUniqueOrThrow({
      where: { id },
      include: {
        jobs: {
          include: { role: { select: { id: true, name: true } } },
          omit: { companyId: true, roleId: true },
        },
      },
    });
    return companies;
  }

  async updateCompanyById(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.prisma.company.update({
      where: { id },
      data: {
        ...updateCompanyDto,
      },
    });
    return company;
  }

  async removeCompany(id: string) {
    await this.prisma.company.delete({
      where: { id },
    });
    return {
      message: 'Company deleted successfully',
    };
  }
}
