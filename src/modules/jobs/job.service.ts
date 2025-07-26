import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryJobDto } from './dto/query-job.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}
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
}
