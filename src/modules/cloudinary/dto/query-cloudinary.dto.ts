import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export enum ImageFolder {
  images_job = 'image',
}

export enum DocFolder {
  cvs_jobs = 'docs',
}
export class QueryImageDto {
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Invalid image url' })
  @Transform(({ value }) => value?.trim())
  'image-url'?: string;

  @IsEnum(ImageFolder, {
    message: 'folder must be "image"',
  })
  folder: ImageFolder;
}
export class QueryDocDto {
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Invalid image url' })
  @Transform(({ value }) => value?.trim())
  'image-url'?: string;

  @IsEnum(DocFolder, {
    message: 'folder must be "docs"',
  })
  folder: DocFolder;
}
