import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryUserDto } from '../users/dto/query-user.dto';
import { JobApplicationStatus } from './enum/job-application.enum';

@Injectable()
export class JobApplicantService {
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
            name: true,
          },
        },
        job: {
          select: { role: { select: { name: true } } },
        },
      },
    });
  }
  async findApplicants(recruiterId: string, query: QueryUserDto) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const applyers = await this.prisma.jobApplication.findMany({
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
    const applyersCount = await this.prisma.jobApplication.count({
      where: { job: { postedBy: recruiterId } },
    });
    return {
      applyers,
      page,
      limit,
      total: applyersCount,
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
}
