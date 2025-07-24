import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateJobDto } from '../job/dto/update-job.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { QueryJobDto } from '../job/dto/query-job.dto';
import { UserRole } from '../users/enum/user.enum';

@Injectable()
export class ApplicantsService {
  constructor(private prisma: PrismaService) {}

  async applyJob(userId: string, jobId: string) {
    const job = await this.prisma.job.findUniqueOrThrow({
      where: { id: jobId, user: { role: UserRole.RECRUITER } },
    });
    if (!job) throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    return await this.prisma.jobApplication.create({ data: { userId, jobId } });
  }

  async findJobs(query: QueryJobDto) {
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);
    const skip = (page - 1) * limit;
    const take = limit;
    const jobs = await this.prisma.job.findMany({
      skip,
      take,
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

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
