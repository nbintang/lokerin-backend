import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
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
      include: { jobs: true, recruiterProfile: true },
    });
    return companies;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
