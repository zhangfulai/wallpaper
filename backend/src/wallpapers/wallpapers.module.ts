import { Module } from '@nestjs/common';
import { WallpapersService } from './wallpapers.service';
import { WallpapersController } from './wallpapers.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WallpapersController],
  providers: [WallpapersService],
})
export class WallpapersModule {}
