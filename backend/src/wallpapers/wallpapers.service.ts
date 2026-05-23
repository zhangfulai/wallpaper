import { Injectable, NotFoundException } from '@nestjs/common';
import { WallpaperStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateWallpaperDto } from './dto/update-wallpaper.dto';
import { QueryWallpaperDto } from './dto/query-wallpaper.dto';

@Injectable()
export class WallpapersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; description?: string; categoryId?: number; tags?: string[]; status?: WallpaperStatus }, imageUrl: string) {
    return this.prisma.wallpaper.create({
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        imageUrl,
        tags: data.tags || [],
        status: data.status,
      },
    });
  }

  async findAll(query: QueryWallpaperDto) {
    const { page = 1, pageSize = 10, keyword, categoryId, status } = query;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { description: { contains: keyword } },
      ];
    }
    if (categoryId) {
      where.categoryId = +categoryId;
    }
    if (status) {
      where.status = status;
    }

    const [list, total] = await Promise.all([
      this.prisma.wallpaper.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      this.prisma.wallpaper.count({ where }),
    ]);

    return { list, total, page, pageSize };
  }

  async findOne(id: number) {
    const wallpaper = await this.prisma.wallpaper.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!wallpaper) {
      throw new NotFoundException('壁纸不存在');
    }
    return wallpaper;
  }

  async update(id: number, dto: UpdateWallpaperDto, file?: Express.Multer.File) {
    await this.findOne(id);

    // 解析 categoryId
    const categoryId = dto.categoryId ? parseInt(dto.categoryId, 10) : undefined;

    // 解析 tags：支持 JSON 数组字符串或逗号分隔字符串
    let parsedTags: string[] | undefined = undefined;
    if (dto.tags) {
      try {
        parsedTags = JSON.parse(dto.tags);
      } catch {
        parsedTags = dto.tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    const data: any = {
      title: dto.title,
      description: dto.description,
      categoryId,
      tags: parsedTags,
      status: dto.status,
    };

    if (file) {
      data.imageUrl = `/uploads/${file.filename}`;
    }

    return this.prisma.wallpaper.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.wallpaper.delete({ where: { id } });
  }
}
