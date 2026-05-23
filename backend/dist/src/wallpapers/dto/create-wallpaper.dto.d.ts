import { WallpaperStatus } from '@prisma/client';
export declare class CreateWallpaperDto {
    title: string;
    description?: string;
    categoryId?: number;
    tags?: string[];
    status?: WallpaperStatus;
}
