import { WallpaperStatus } from '@prisma/client';
export declare class UpdateWallpaperDto {
    title?: string;
    description?: string;
    categoryId?: number;
    tags?: string[];
    status?: WallpaperStatus;
}
