import { WallpaperStatus } from '@prisma/client';
export declare class QueryWallpaperDto {
    page?: number;
    pageSize?: number;
    keyword?: string;
    categoryId?: number;
    status?: WallpaperStatus;
}
