import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { MailModule } from './common/mail/mail.module';
import { LoggerModule } from './common/logger/logger.module';
import { UsersModule } from './modules/users/users.module';
import { CompanyModule } from './modules/company/company.module';
import { RoleModule } from './modules/role/role.module';
import { CvModule } from './modules/cv/cv.module';
import { JobModule } from './modules/job/job.module';
import { JobApplicationModule } from './modules/job-application/job-application.module';
import { AuthModule } from './modules/auth/auth.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    LoggerModule,
    UsersModule,
    CompanyModule,
    RoleModule,
    CvModule,
    JobModule,
    JobApplicationModule,
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
