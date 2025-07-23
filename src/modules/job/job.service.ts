import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateJobDto } from './dto/update-job.dto';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { QueryJobDto } from './dto/query-job.dto';
export type JobMatchResult = {
  id: string;
  title: string;
  score: number;
};

export type JobMatchingAPIResponse = {
  resume_text: string;
  results: JobMatchResult[];
} | null;

@Injectable()
export class JobService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}
  async recommendJobs(file: Express.Multer.File, query: QueryJobDto) {
    const offset = query.offset ?? 0;
    const limit = query.limit ?? 50;

    // Dapatkan total count untuk client paging
    const totalJobs = await this.prisma.job.count();

    // Ambil hanya slice yang diminta
    const jobs = await this.prisma.job.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    // Siapkan FormData dan kirim ke FastAPI
    const form = new FormData();
    form.append('resume', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    form.append(
      'job_data',
      JSON.stringify(
        jobs.map((j) => ({
          id: j.id,
          title: j.title,
          description: j.description,
        })),
      ),
    );

    const response = await firstValueFrom(
      this.httpService.post<JobMatchingAPIResponse>(
        'https://bxntang-job-recommendation.hf.space/recommend-jobs',
        form,
        { headers: form.getHeaders() },
      ),
    );

    const results = response.data?.results ?? [];
    const jobMap = new Map(jobs.map((j) => [j.id, j]));
    const recommendations = results
      .map((r) => {
        const job = jobMap.get(r.id);
        if (!job) return null;
        return {
          job,
          matchPercentage: Math.round(r.score * 100),
          score: r.score,
        };
      })
      .filter(Boolean);

    return {
      recommendations,
      totalJobs,
      recommendedJobs: recommendations.length,
      nextOffset: offset + limit < totalJobs ? offset + limit : null,
      limit,
    };
  }

  findAll() {
    return `This action returns all job`;
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
