import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { BadRequestException, Injectable } from '@nestjs/common';

export interface JobMatchingAPIResponse {
  resume_preview: string;
  results: Result[];
  metadata: Metadata;
}

export interface Result {
  id: string;
  title: string;
  score: number;
}

export interface Metadata {
  total_jobs_processed: number;
  matching_jobs: number;
  min_score_threshold: number;
  processing_time_seconds: number;
  cache_hit: boolean;
  model_used: string;
}
@Injectable()
export class AiJobService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}
  async recommendJobs(file: Express.Multer.File) {
    try {
      const totalJobs = await this.prisma.job.count();
      const jobs = await this.prisma.job.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          salaryRange: true,
          company: {
            select: {
              name: true,
            },
          },
        },
      });
      if (jobs.length === 0) {
        throw new BadRequestException('No active jobs found');
      }
      const jobData = jobs.map((job) => ({
        id: job.id.toString(),
        title: job.title,
        location: job.location,
        description: `${job.title}. ${job.description}.`,
      }));
      const form = new FormData();
      form.append('resume', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
      form.append('job_data', JSON.stringify(jobData));
      const response = await firstValueFrom(
        this.httpService.post<JobMatchingAPIResponse | null>(
          'http://127.0.0.1:8000/recommend-jobs',
          form,
          { headers: { ...form.getHeaders() }, timeout: 60000 },
        ),
      );
      console.log(response);
      const results = response.data?.results ?? [];

      const enrichedResults = await Promise.all(
        results.map(async (result) => {
          const job = await this.prisma.job.findUnique({
            where: { id: result.id },
            select: {
              id: true,
              title: true,
              description: true,
              location: true,
              salaryRange: true,
              company: {
                select: {
                  name: true,
                },
              },
            },
          });
          return {
            ...job,
            score: result.score,
            matchPercentage: Math.round(result.score * 100),
          };
        }),
      );

      return {
        recommendations: enrichedResults,
        totalJobs,
        recommendedJobs: enrichedResults.length,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('File is required');
    }
  }
}
