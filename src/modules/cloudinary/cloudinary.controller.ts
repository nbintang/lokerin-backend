import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from '../users/enum/user.enum';
import {
  ParseDocFilePipe,
  ParseImageFilePipe,
} from './dto/create-cloudinary.dto';
import { QueryDocDto, QueryImageDto } from './dto/query-cloudinary.dto';
@UseGuards(AccessTokenGuard, RoleGuard)
@UseInterceptors(FileInterceptor('file'))
@Controller('/protected/upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER, UserRole.MEMBER)
  @Post('/image')
  async uploadImage(
    @UploadedFile(ParseImageFilePipe) file: Express.Multer.File,
    @Query() query: QueryImageDto,
  ) {
    const { folder } = query;
    const exitedPublicId = query['image-url']
      ? this.cloudinaryService.extractPublicId(query['image-url'])
      : undefined;

    const { secure_url, public_id, created_at } =
      await this.cloudinaryService.uploadFile({
        file,
        folder,
        public_id: exitedPublicId,
      });

    return {
      message: `Image uploaded to ${folder} successfully`,
      data: {
        secureUrl: secure_url,
        publicId: public_id,
        createdAt: created_at,
      },
    };
  }

  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER, UserRole.MEMBER)
  @Post('/document')
  async uploadDocument(
    @UploadedFile(ParseDocFilePipe) file: Express.Multer.File,
    @Query() query: QueryDocDto,
  ) {
    const { folder } = query;
    const exitedPublicId = query['image-url']
      ? this.cloudinaryService.extractPublicId(query['image-url'])
      : undefined;

    const { secure_url, public_id, created_at } =
      await this.cloudinaryService.uploadFile({
        file,
        folder,
        public_id: exitedPublicId,
      });

    return {
      message: `Document uploaded to ${folder} successfully`,
      data: {
        secureUrl: secure_url,
        publicId: public_id,
        createdAt: created_at,
      },
    };
  }
}
