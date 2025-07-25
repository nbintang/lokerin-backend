import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ParseDocFilePipe,
  ParseImageFilePipe,
} from './dto/create-cloudinary.dto';
import { QueryDocDto, QueryImageDto } from './dto/query-cloudinary.dto';
@UseInterceptors(FileInterceptor('file'))
@Controller('/protected/upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
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
         secureUrl: secure_url,
        publicId: public_id,
        createdAt: created_at,
    };
  }

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
   secureUrl: secure_url,
        publicId: public_id,
        createdAt: created_at,
    };
  }
}
