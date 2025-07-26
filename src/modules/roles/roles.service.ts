import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryRoleDto } from './dto/query-role.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}
  async createRole(createRoleDto: CreateRoleDto) {
    return await this.prisma.role.upsert({
      where: {
        name: createRoleDto.name,
      },
      update: {},
      create: {
        name: createRoleDto.name,
      },
    });
  }

  async findAllRoleWithUsers(query: QueryRoleDto) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Prisma.RoleWhereInput = {
      ...(query.name && {
        name: { contains: query.name, mode: 'insensitive' },
      }),
    };
    const roles = await this.prisma.role.findMany({
      where,
      include: {
        RecruiterProfile: true,
      },
      skip,
      take,
    });
    const rolesCount = await this.prisma.role.count({ where });
    return {
      roles,
      page,
      limit,
      total: rolesCount,
    };
  }
  async findAllRoles(query: QueryRoleDto) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Prisma.RoleWhereInput = {
      ...(query.name && {
        name: { contains: query.name, mode: 'insensitive' },
      }),
    };
    const roles = await this.prisma.role.findMany({
      where,
      skip,
      take,
    });
    const rolesCount = await this.prisma.role.count({ where });
    return {
      roles,
      page,
      limit,
      total: rolesCount,
    };
  }

  async removeRole(id: string) {
    await this.prisma.role.delete({
      where: { id },
    });
    return { message: 'Role deleted successfully' };
  }
}
