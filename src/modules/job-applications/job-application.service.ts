import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { QueryUserDto } from '../users/dto/query-user.dto';
import { JobApplicationStatus } from './enum/job-application.enum';
import { UserRole } from '../users/enum/user.enum';

@Injectable()
export class JobApplicationService {
  constructor(private readonly prisma: PrismaService) {}
  async applyJob(userId: string, id: string) {
    const job = await this.prisma.job.findUniqueOrThrow({
      where: { id, user: { role: UserRole.RECRUITER } },
    });
    if (!job) throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    return await this.prisma.jobApplication.create({
      data: { userId, jobId: id },
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
          select: { id: true, title: true },
        },
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const applyersCount = await this.prisma.jobApplication.count({
      where: { job: { postedBy: recruiterId } },
    });
    return {
      applyers,
      meta: {
        page,
        limit,
        total: applyersCount,
      },
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
    return this.prisma.jobApplication.update({
      where: { id: application.id },
      data: { status },
    });
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
            title: true,
            location: true,
            description: true,
            role: {
              select: {
                name: true,
              },
            },
            company: {
              select: {
                name: true,
                logoUrl: true,
                description: true,
                website: true,
              },
            },
          },
        },
      },
    });
    return applications;
  }
}
