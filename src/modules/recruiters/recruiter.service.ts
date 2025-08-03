// ../../recruiters/recruiters.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryUserDto } from '../../modules/users/dto/query-user.dto';
import { UserRole } from '../../modules/users/enum/user.enum';
import { CreateRecruiterProfileDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterProfileDto } from './dto/update-recruiter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RecruitersService {
  constructor(private readonly prisma: PrismaService) {}
  async findRecruiters(query: QueryUserDto) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Prisma.RecruiterProfileWhereInput = {
      ...(query.name && {
        user: {
          name: { contains: query.name, mode: 'insensitive' },
        },
      }),
    };
    const recruiters = await this.prisma.recruiterProfile.findMany({
      where,
      include: {
        position: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
      },
      skip,
      take,
      omit: { roleId: true, userId: true, companyId: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prisma.recruiterProfile.count({ where });
    return {
      recruiters,
      total,
      page,
      limit,
    };
  }

  async createUserWithRecruiter(dto: CreateRecruiterProfileDto) {
    const { about, position, companyId, ...userInput } = dto;
    const existedUser = await this.prisma.user.findUnique({
      where: {
        email: userInput.email,
      },
    });
    if (existedUser) throw new BadRequestException('User already exists');
    const user = await this.prisma.user.create({
      data: {
        ...userInput,
        role: UserRole.RECRUITER,
      },
    });
    if (user) {
      const recruiter = await this.prisma.recruiterProfile.create({
        data: {
          about,
          position: {
            connectOrCreate: {
              where: { name: position },
              create: { name: position },
            },
          },
          company: {
            connect: { id: companyId },
          },
          user: {
            connect: { id: user.id },
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
    return null;
  }
  async findRecruiterById(id: string) {
    return await this.prisma.recruiterProfile.findUnique({
      where: { id },
      include: {
        user: { omit: { password: true, role: true } },
        company: true,
        position: true,
      },
      omit: { roleId: true, userId: true, companyId: true },
    });
  }
  async findRecruiterByUserId(id: string) {
    return await this.prisma.recruiterProfile.findUnique({
      where: { userId: id },
      include: {
        user: { omit: { password: true, role: true } },
        company: true,
        position: true,
      },
      omit: { roleId: true, userId: true, companyId: true },
    });
  }
  async updateRecruiterByUserId(
    id: string,
    updateUserDto: UpdateRecruiterProfileDto,
  ) {
    const { about, position, ...userDto } = updateUserDto;
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...userDto,
        recruiterProfile: {
          update: {
            about,
            position: {
              connectOrCreate: {
                where: { name: position },
                create: { name: position },
              },
            },
          },
        },
      },
      omit: { password: true, role: true },
      include: {
        recruiterProfile: {
          include: {
            position: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          omit: { userId: true, roleId: true, companyId: true },
        },
      },
    });
    return user;
  }

  async deleteRecruiter(id: string) {
    const recruiter = await this.prisma.recruiterProfile.delete({
      where: { id },
    });
    const user = await this.prisma.user.update({
      where: { id: recruiter.userId },
      data: { role: UserRole.MEMBER },
      omit: { password: true },
    });
    return {
      message: 'Recruiter deleted successfully',
      user,
    };
  }
}
