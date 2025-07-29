import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { Cloudinary as CloudinaryProvider } from './config/cloudinary.config';
import { CloudinaryController } from './cloudinary.controller';
import { AccessControlService } from '../auth/shared/access-control.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  providers: [CloudinaryProvider, CloudinaryService, AccessControlService],
  controllers: [CloudinaryController],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
