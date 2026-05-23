import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { WallpapersService } from './wallpapers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateWallpaperDto } from './dto/create-wallpaper.dto';
import { UpdateWallpaperDto } from './dto/update-wallpaper.dto';
import { QueryWallpaperDto } from './dto/query-wallpaper.dto';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, uniqueSuffix + extname(file.originalname));
  },
});

@ApiTags('壁纸')
@Controller('wallpapers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WallpapersController {
  constructor(private readonly wallpapersService: WallpapersService) {}

  @Post()
  @ApiOperation({ summary: '创建壁纸' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        categoryId: { type: 'number' },
        tags: { type: 'string' },
        status: { type: 'string', enum: ['ACTIVE', 'DISABLED'] },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/image\/(jpeg|png|jpg|gif|webp)/)) {
          return callback(new BadRequestException('只允许上传图片文件'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  create(
    @Body() dto: CreateWallpaperDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('请上传图片');
    }

    // 解析 categoryId
    const categoryId = dto.categoryId ? parseInt(dto.categoryId, 10) : undefined;

    // 解析 tags：支持 JSON 数组字符串或逗号分隔字符串
    let parsedTags: string[] = [];
    if (dto.tags) {
      try {
        parsedTags = JSON.parse(dto.tags);
      } catch {
        parsedTags = dto.tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    const imageUrl = `/uploads/${file.filename}`;
    return this.wallpapersService.create(
      { ...dto, categoryId, tags: parsedTags },
      imageUrl,
    );
  }

  @Get()
  @ApiOperation({ summary: '获取壁纸列表' })
  findAll(@Query() query: QueryWallpaperDto) {
    return this.wallpapersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取壁纸详情' })
  findOne(@Param('id') id: string) {
    return this.wallpapersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新壁纸' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        categoryId: { type: 'number' },
        tags: { type: 'string' },
        status: { type: 'string', enum: ['ACTIVE', 'DISABLED'] },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/image\/(jpeg|png|jpg|gif|webp)/)) {
          return callback(new BadRequestException('只允许上传图片文件'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWallpaperDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.wallpapersService.update(+id, dto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除壁纸' })
  remove(@Param('id') id: string) {
    return this.wallpapersService.remove(+id);
  }
}
