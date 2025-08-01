import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { QueryUserDto } from './dto/query-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async createUser(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: { ...createUserDto },
    });
    return user;
  }

  async findAllUsers(query: QueryUserDto) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Prisma.UserWhereInput = {
      ...(query.name && {
        name: { contains: query.name, mode: 'insensitive' },
      }),
      ...(query.email && {
        email: { contains: query.email, mode: 'insensitive' },
      }),
      role: {
        ...(query.role && { equals: query.role }),
        not: 'ADMINISTRATOR',
      },
    };

    const users = await this.prisma.user.findMany({
      where,
      skip,
      take,
      omit: { password: true },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const userCount = await this.prisma.user.count({
      where,
    });

    return {
      users,
      page,
      limit,
      total: userCount,
    };
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      omit: { password: true },
    });
    await this.prisma.jobApplication.findMany({ where: { userId: id } });
    return user;
  }
  findUserByEmail(email: string) {
    const user = this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
  findUserByPhone(phone: string) {
    const user = this.prisma.user.findUnique({
      where: { phone },
    });
    return user;
  }
  async updateUserById(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
      omit: { password: true, role: true },
    });
    return user;
  }

  updatePassword(id: string, password: string) {
    const user = this.prisma.user.update({
      where: { id },
      data: { password },
    });
    return user;
  }
  verifiedUser(id: string) {
    const user = this.prisma.user.update({
      where: { id },
      data: { isVerified: true },
    });
    return user;
  }
  remove(id: string) {
    this.prisma.user.delete({
      where: { id },
    });
    return { message: 'User deleted successfully' };
  }
}
