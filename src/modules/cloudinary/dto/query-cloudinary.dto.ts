import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export enum ImageFolder {
  images_job = 'lokerin',
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
