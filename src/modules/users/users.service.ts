import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user/create-user.dto';
import { UpdateUserDto } from './dto/user/update-user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  createUser(createUserDto: CreateUserDto) {
    const user = this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        phone: createUserDto.phone,
        password: createUserDto.password,
        avatarUrl: createUserDto.avatarUrl,
      },
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
      include: {
        recruiterProfile: true,
      },
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

  findUserById(id: string) {
    const user = this.prisma.user.findUnique({
      where: {
        id: id,
      },
      omit: { password: true },
    });
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
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
