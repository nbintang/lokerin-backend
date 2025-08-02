import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../common/prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InputAIJobDto } from './dto/input-ai-job.dto';
import { Prisma } from '@prisma/client';

export interface JobMatchingAPIResponse {
  resume_preview: string;
  results: JobResult[];
  metadata: Metadata;
}

export interface JobResult {
  id: string;
  title: string;
  score: number;
}

export interface Metadata {
  input_type: 'url' | 'file_upload';
  source: string;
  total_jobs_processed: number;
  matching_jobs: number;
  min_score_threshold: number;
  processing_time_seconds: number;
  cache_hit: boolean;
  model_used: string;
}

@Injectable()
export class AiJobService {
  private MODEL_URL = 'https://bxntang-job-recommendation.hf.space';
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  public async recommendJobs(
    file: Express.Multer.File,
    input: InputAIJobDto,
    userId: string,
  ) {
    try {
      if (!file && !input.resumeUrl) {
        throw new BadRequestException(
          'Either file or resume URL must be provided',
        );
      }
      if (file && input.resumeUrl) {
        throw new BadRequestException(
          'Provide either file or resume URL, not both',
        );
      }
      if (file && !file.originalname?.toLowerCase().endsWith('.pdf')) {
        throw new BadRequestException('Only PDF files are supported');
      }
      if (input.minScore && (input.minScore < 0.1 || input.minScore > 1.0)) {
        throw new BadRequestException('Min score must be between 0.1 and 1.0');
      }
      const { jobs, totalJobs } = await this.getJobData(userId);
      if (jobs.length === 0) {
        throw new BadRequestException('No active jobs found');
      }
      const jobData = jobs.map((job) => ({
        id: job.id.toString(),
        title: job.role.name,
        location: job.location,
        description: `${job.role.name}. ${job.description}.`,
      }));

      const form = new FormData();

      if (file) {
        form.append('resume', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      } else {
        form.append('resume_url', input.resumeUrl);
      }

      form.append('job_data', JSON.stringify(jobData));
      form.append('min_score', (input.minScore || 0.43).toString());
      const response = await firstValueFrom(
        this.httpService.post<JobMatchingAPIResponse | null>(
          `${this.MODEL_URL}/recommend-jobs`,
          form,
          { headers: { ...form.getHeaders() }, timeout: 60000 },
        ),
      );
      this.logger.log('AI Classification Result:', {
        input_type: response.data?.metadata?.input_type,
        source: response.data?.metadata?.source,
        matching_jobs: response.data?.metadata?.matching_jobs,
        processing_time: response.data?.metadata?.processing_time_seconds,
      });
      const results = response.data?.results ?? [];
      const enrichedResults = await this.enrichJobResults(results);
      return {
        recommendations: enrichedResults,
        totalJobs,
        recommendedJobs: enrichedResults.length,
        metadata: response.data?.metadata,
      };
    } catch (error) {
      this.logger.error('Job recommendation failed', {
        error: error.message,
        stack: error.stack,
        input: {
          hasFile: !!file,
          hasUrl: !!input.resumeUrl,
          minScore: input.minScore,
        },
      });
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Job recommendation service is currently unavailable',
      );
    }
  }

  private async getJobData(userId: string) {
    const where: Prisma.JobWhereInput = { applications: { none: { userId } } };
    const totalJobs = await this.prisma.job.count({ where });
    const jobs = await this.prisma.job.findMany({
      where,
      select: {
        id: true,
        role: {
          select: {
            name: true,
          },
        },
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
    return { totalJobs, jobs };
  }

  private async enrichJobResults(results: JobResult[]) {
    return await Promise.all(
      results.map(async (result) => {
        const job = await this.prisma.job.findUnique({
          where: { id: result.id },
          select: {
            id: true,
            role: {
              select: {
                name: true,
              },
            },
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
  }
}
