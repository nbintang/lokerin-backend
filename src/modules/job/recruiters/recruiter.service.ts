// src/modules/recruiters/recruiters.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { QueryUserDto } from 'src/modules/users/dto/query-user.dto';
import { CreateRecruiterProfileDto } from 'src/modules/job/dto/recruiter/create-recruiter.dto';
import { UserRole } from 'src/modules/users/enum/user.enum';
import { JobApplicationStatus } from '../enum/job.enum';

@Injectable()
export class RecruitersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserWithRecruiter(dto: CreateRecruiterProfileDto) {
    const { about, companyName, position, website, ...userInput } = dto;
    const recruiter = await this.prisma.recruiterProfile.create({
      data: {
        about,
        companyName,
        position,
        website,
        user: {
          create: {
            role: UserRole.RECRUITER,
            ...userInput,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
    return recruiter;
  }

  async findApplicantsByRecruiter(recruiterId: string, query: QueryUserDto) {
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
        user: true,
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
    userId: string,
    jobId: string,
    status: JobApplicationStatus,
  ) {
    const application = await this.prisma.jobApplication.findFirst({
      where: { userId, jobId },
    });
    if (!application) throw new NotFoundException('Application not found');
    return this.prisma.jobApplication.update({
      where: { id: application.id },
      data: { status },
    });
  }
}
