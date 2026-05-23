import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WallpaperStatus } from '@prisma/client';

export class CreateWallpaperDto {
  @ApiProperty({ description: '壁纸标题' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: '壁纸描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: '标签，JSON数组字符串或逗号分隔' })
  @IsString()
  @IsOptional()
  tags?: string;

  @ApiPropertyOptional({ description: '状态', enum: WallpaperStatus })
  @IsEnum(WallpaperStatus)
  @IsOptional()
  status?: WallpaperStatus;
}
