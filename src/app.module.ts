import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { MailModule } from './common/mail/mail.module';
import { LoggerModule } from './common/logger/logger.module';
import { UsersModule } from './modules/users/users.module';
import { JobModule } from './modules/jobs/job.module';
import { AuthModule } from './modules/auth/auth.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { RecruiterModule } from './modules/recruiters/recruiter.module';
import { JobApplicationModule } from './modules/job-applications/job-application.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    LoggerModule,
    UsersModule,
    JobModule,
    AuthModule,
    CloudinaryModule,
    RecruiterModule,
    JobApplicationModule,
    CompaniesModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
