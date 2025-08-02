import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryUserDto } from '../users/dto/query-user.dto';
import { JobApplicationStatus } from './enum/job-application.enum';
import { QueryJobApplicationDto } from './dto/query-job-application.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobApplicantService {
  constructor(private readonly prisma: PrismaService) {}

  async findApplicantsApplied(recruiterId: string, query: QueryUserDto) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const appliers = await this.prisma.jobApplication.findMany({
      where: {
        job: {
          postedBy: recruiterId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            avatarUrl: true,
            name: true,
            cvUrl: true,
          },
        },
        job: {
          select: { id: true, role: { select: { name: true } } },
        },
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      omit: { jobId: true, userId: true },
    });
    const appliersCount = await this.prisma.jobApplication.count({
      where: { job: { postedBy: recruiterId } },
    });
    return {
      appliers,
      page,
      limit,
      total: appliersCount,
    };
  }

  async findApplicants(query: QueryJobApplicationDto) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Prisma.JobApplicationWhereInput = {
      ...(query.name && {
        user: {
          name: { contains: query.name, mode: 'insensitive' },
        },
      }),
      ...(query.recruiterId && {
        job: {
          postedBy: query.recruiterId,
        },
      }),
    };

    const appliers = await this.prisma.jobApplication.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            avatarUrl: true,
            name: true,
            cvUrl: true,
          },
        },
        job: {
          select: { id: true, role: { select: { name: true } } },
        },
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      omit: { jobId: true, userId: true },
    });
    const appliersCount = await this.prisma.jobApplication.count({ where });
    return {
      appliers,
      page,
      limit,
      total: appliersCount,
    };
  }
  async updateApplicantStatusByRecruiter(
    applicantId: string,
    jobId: string,
    status: JobApplicationStatus,
  ) {
    const application = await this.prisma.jobApplication.findFirst({
      where: { AND: [{ id: applicantId }, { jobId }] },
    });
    if (!application) throw new NotFoundException('Application not found');
    const job = await this.prisma.jobApplication.update({
      where: { id: application.id },
      data: { status },
    });

    return await this.findApplicantById(job.id);
  }

  async findApplicantById(id: string) {
    const applications = await this.prisma.jobApplication.findFirst({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            avatarUrl: true,
            createdAt: true,
            cvUrl: true,
            updatedAt: true,
          },
        },
        job: {
          select: {
            id: true,
            location: true,
            description: true,
            role: {
              select: {
                id: true,
                name: true,
              },
            },
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                description: true,
                website: true,
              },
            },
          },
        },
      },
      omit: { jobId: true, userId: true },
    });
    return applications;
  }

  async findAppliedJobsByUserId(userId: string, dto: QueryJobApplicationDto) {
    const page = +(dto.page || 1);
    const limit = +(dto.limit || 10);
    const take = limit;
    const skip = (page - 1) * limit;
    const where: Prisma.JobApplicationWhereInput = {
      userId,
      ...(dto.status && { status: dto.status as JobApplicationStatus }),
      ...(dto.jobId && { jobId: dto.jobId }),
    };
    const appliedJobs = await this.prisma.jobApplication.findMany({
      where,
      include: {
        job: {
          select: {
            id: true,
            location: true,
            description: true,
            role: {
              select: {
                id: true,
                name: true,
              },
            },
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                description: true,
                website: true,
              },
            },
          },
        },
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      omit: { jobId: true, userId: true },
    });
    const appliedJobCount = await this.prisma.jobApplication.count({
      where,
    });
    return {
      appliedJobs,
      page,
      limit,
      total: appliedJobCount,
    };
  }

  async findAppliedJobByIdAndUserId(
    id: string,
    userId: string,
    { jobId }: QueryJobApplicationDto,
  ) {
    const applications = await this.prisma.jobApplication.findFirst({
      where: { AND: [{ id }, { userId }], ...(jobId && { jobId }) },
      include: {
        job: {
          select: {
            id: true,
            location: true,
            description: true,
            role: {
              select: {
                id: true,
                name: true,
              },
            },
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                description: true,
                website: true,
              },
            },
          },
        },
      },
      omit: { jobId: true, userId: true },
    });
    return applications;
  }

  async deleteApplicantById(id: string) {
    return await this.prisma.jobApplication.delete({ where: { id } });
  }
}
