import {
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ParseDocFilePipe,
  ParseImageFilePipe,
} from './dto/create-cloudinary.dto';
import { QueryCloudinaryDto } from './dto/query-cloudinary.dto';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';

@Controller('/upload')
export class CloudinaryController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly httpService: HttpService,
  ) {}
  @Post('/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(ParseImageFilePipe) file: Express.Multer.File,
    @Query() query: QueryCloudinaryDto,
  ) {
    const { folder, existedUrl } = query;
    const exitedPublicId = existedUrl
      ? this.cloudinaryService.extractPublicId(existedUrl)
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
  @UseInterceptors(FileInterceptor('document'))
  async uploadDocument(
    @UploadedFile(ParseDocFilePipe) file: Express.Multer.File,
    @Query() query: QueryCloudinaryDto,
  ) {
    const { folder, existedUrl } = query;
    const exitedPublicId = existedUrl
      ? this.cloudinaryService.extractPublicId(existedUrl)
      : undefined;
    const { public_id, created_at } = await this.cloudinaryService.uploadFile({
      file,
      folder,
      public_id: exitedPublicId,
    });
    // Build your own download-endpoint URL
    const downloadEndpoint =
      `${process.env.PROD_BACKEND_URL || 'http://localhost:3000'}` +
      `/api/upload/document/download?publicId=${encodeURIComponent(public_id)}`;
    return {
      message: `Document uploaded to ${folder} successfully`,
      secureUrl: downloadEndpoint,
      publicId: public_id,
      createdAt: created_at,
    };
  }

  @Get('/document/download')
  async downloadDocument(
    @Query('publicId') publicId: string,
    @Res() res: Response,
  ) {
    if (!publicId) throw new NotFoundException('publicId required');
    const info = await this.cloudinaryService.getResource(publicId, 'raw');
    const url = info.secure_url;
    const axiosResp = await lastValueFrom(
      this.httpService.get<Buffer>(url, { responseType: 'arraybuffer' }),
    );
    const buffer = Buffer.from(axiosResp.data);
    res
      .status(200)
      .set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${publicId}.pdf"`,
        'Content-Length': buffer.byteLength,
      })
      .send(buffer);
  }
}
