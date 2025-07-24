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

  findAllUsers(query: QueryUserDto) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Prisma.UserWhereInput = {
      ...{ name: { contains: query.name } },
      ...{ email: { contains: query.email } },
      ...{ role: { equals: query.role } },
    };

    const users = this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const userCount = this.prisma.user.count({
      where,
    });

    return {
      users,
      meta: {
        page,
        limit,
        total: userCount,
      },
    };
  }

  findUserById(id: string) {
    const user = this.prisma.user.findUnique({
      where: {
        id: id,
      },
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
  updateUserById(id: string, updateUserDto: UpdateUserDto) {
    const user = this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
    return user;
  }

  updateVerifiedById(id: string) {
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
