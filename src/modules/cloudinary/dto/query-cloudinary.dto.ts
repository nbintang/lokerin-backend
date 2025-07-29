import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';
export enum CloudinaryFolder {
  lokerinImage = 'lokerin_image',
  lokerinCv = 'lokerin_cv',
}
export class QueryCloudinaryDto {
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Invalid URL' })
  @Transform(({ value }) => value?.trim())
  existedUrl?: string;

  @IsEnum(CloudinaryFolder, {
    message: 'folder must be one of "lokerin_image" or "lokerin_cv"',
  })
  folder: CloudinaryFolder;
}
