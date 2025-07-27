import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryJobDto } from './dto/query-job.dto';
import { Prisma } from '@prisma/client';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async createJob(data: CreateJobDto, userId: string) {
    const companyByRecruiterProfile =
      await this.prisma.recruiterProfile.findUniqueOrThrow({
        where: { userId },
        select: {
          companyId: true,
        },
      });
    return await this.prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        role: {
          connectOrCreate: {
            where: { name: data.role },
            create: { name: data.role },
          },
        },
        company: {
          connect: {
            id: companyByRecruiterProfile.companyId,
          },
        },
        salaryRange: data.salaryRange,
        user: { connect: { id: userId } },
      },
      omit: { roleId: true, companyId: true },
      include: {
        role: { select: { id: true, name: true } },
        company: { select: { id: true, name: true } },
      },
    });
  }

  async updateJob(id: string, data: UpdateJobDto) {
    return await this.prisma.job.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        salaryRange: data.salaryRange,
        location: data.location,
      },
      omit: { roleId: true, companyId: true },
      include: {
        role: { select: { id: true, name: true } },
        company: { select: { id: true, name: true } },
      },
    });
  }

  async findJobs(query: QueryJobDto) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Prisma.JobWhereInput = {
      ...(query.name && {
        title: { contains: query.name, mode: 'insensitive' },
      }),
    };
    const jobs = await this.prisma.job.findMany({
      where,
      skip,
      take,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const jobsCount = await this.prisma.job.count({ where });
    return {
      jobs,
      page,
      limit,
      total: jobsCount,
    };
  }

  async findJobById(jobId: string) {
    const job = await this.prisma.job.findUniqueOrThrow({
      where: { id: jobId },
      include: { company: true, role: true },
    });
    return job;
  }

  async deleteJob(jobId: string) {
    await this.prisma.job.delete({ where: { id: jobId } });
    return { message: 'Job deleted successfully' };
  }
}
