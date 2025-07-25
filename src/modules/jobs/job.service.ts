import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { QueryJobDto } from './dto/query-job.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}
  async findJobs(query: QueryJobDto) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const jobs = await this.prisma.job.findMany({
      skip,
      take,
      include: {
        company: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const jobsCount = await this.prisma.job.count();
    return {
      jobs,
      meta: {
        page,
        limit,
        total: jobsCount,
      },
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
