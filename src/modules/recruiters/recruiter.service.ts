// src/modules/recruiters/recruiters.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { QueryUserDto } from 'src/modules/users/dto/query-user.dto';
import { UserRole } from 'src/modules/users/enum/user.enum';
import { CreateRecruiterProfileDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterProfileDto } from './dto/update-recruiter.dto';

@Injectable()
export class RecruitersService {
  constructor(private readonly prisma: PrismaService) {}
  async findRecruiters(query: QueryUserDto) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const recruiters = await this.prisma.recruiterProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      skip,
      take,
    });
    return recruiters;
  }

  async createUserWithRecruiter(dto: CreateRecruiterProfileDto) {
    const { about, companyName, position, website, ...userInput } = dto;
    const existedUser = await this.prisma.user.findUnique({
      where: {
        email: userInput.email,
      },
    });
    if (existedUser) throw new BadRequestException('User already exists');
    const recruiter = await this.prisma.recruiterProfile.create({
      data: {
        about,
        companyName,
        position,
        website,
        user: {
          create: {
            role: UserRole.RECRUITER,
            ...userInput,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
    return recruiter;
  }

  async findRecruiterById(id: string) {
    const recruiter = await this.prisma.recruiterProfile.findUnique({
      where: { id },
    });
    return recruiter;
  }
  async updateRecruiter(id: string, dto: UpdateRecruiterProfileDto) {
    const updatedRecruiter = await this.prisma.recruiterProfile.update({
      where: { id },
      data: { ...dto },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
    return updatedRecruiter;
  }
  async deleteRecruiter(id: string) {
    return await this.prisma.recruiterProfile.delete({
      where: { id },
    });
  }
}
