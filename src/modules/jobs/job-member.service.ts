import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JobApplicationStatus } from '../job-applicants/enum/job-application.enum';
import { QueryJobDto } from './dto/query-job.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobMemberService {
  constructor(private readonly prisma: PrismaService) {}
  async applyJobApplications(userId: string, id: string) {
    const job = await this.prisma.job.findUniqueOrThrow({
      where: { id },
    });
    if (!job) throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    return await this.prisma.jobApplication.create({
      data: { userId, jobId: job.id, status: JobApplicationStatus.APPLIED },
      omit: { jobId: true, userId: true },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            avatarUrl: true,
            cvUrl: true,
            name: true,
          },
        },
        job: {
          select: { role: { select: { name: true } } },
        },
      },
    });
  }
  async findJobs(query: QueryJobDto, userId: string) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const { status, name, companyId } = query;
    const where: Prisma.JobWhereInput = {
      ...(name && {
        role: { name: { contains: name, mode: 'insensitive' } },
      }),
      ...(companyId && { companyId: companyId }),
      ...(status != null && {
        applications: { some: { userId, status } },
      }),
      ...(status == null && {
        applications: { none: { userId } },
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
        role: { select: { id: true, name: true } },
      },
      omit: { roleId: true, companyId: true },
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
}
