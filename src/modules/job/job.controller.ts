import { Controller, Get, Query } from '@nestjs/common';
import { ApplicantsService } from './applicants/applicants.service';
import { QueryJobDto } from './dto/query-job.dto';

@Controller('jobs')
export class JobController {
  constructor(private readonly appplicantService: ApplicantsService) {}

  @Get()
  async findJobs(@Query() query: QueryJobDto) {
    return await this.appplicantService.findJobs(query);
  }
}
