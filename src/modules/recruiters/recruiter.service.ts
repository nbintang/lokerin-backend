// src/modules/recruiters/recruiters.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { QueryUserDto } from 'src/modules/users/dto/query-user.dto';
import { UserRole } from 'src/modules/users/enum/user.enum';
import { CreateRecruiterProfileDto } from './dto/create-recruiter.dto';
import { JobApplicationStatus } from '../job/enum/job.enum';

@Injectable()
export class RecruitersService {
  constructor(private readonly prisma: PrismaService) {}
  async findRecruiters(query: QueryUserDto) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const recruiters = await this.prisma.recruiterProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      skip,
      take,
    });
    return recruiters;
  }

  async createUserWithRecruiter(dto: CreateRecruiterProfileDto) {
    const { about, companyName, position, website, ...userInput } = dto;
    const existedUser = await this.prisma.user.findUnique({
      where: {
        email: userInput.email,
      },
    });
    if (existedUser) throw new BadRequestException('User already exists');
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

  async findApplicantByApplicantId(applicantId: string) {
    const applications = await this.prisma.jobApplication.findFirst({
      where: {
        id: applicantId,
      },
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
