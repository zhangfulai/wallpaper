import { PrismaService } from '../prisma/prisma.service';
import { CreateWallpaperDto } from './dto/create-wallpaper.dto';
import { UpdateWallpaperDto } from './dto/update-wallpaper.dto';
import { QueryWallpaperDto } from './dto/query-wallpaper.dto';
export declare class WallpapersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateWallpaperDto, imageUrl: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        tags: string[];
        imageUrl: string;
        thumbnailUrl: string | null;
        categoryId: number | null;
        status: import(".prisma/client").$Enums.WallpaperStatus;
    }>;
    findAll(query: QueryWallpaperDto): Promise<{
        list: ({
            category: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                sort: number;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            tags: string[];
            imageUrl: string;
            thumbnailUrl: string | null;
            categoryId: number | null;
            status: import(".prisma/client").$Enums.WallpaperStatus;
        })[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: number): Promise<{
        category: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            sort: number;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        tags: string[];
        imageUrl: string;
        thumbnailUrl: string | null;
        categoryId: number | null;
        status: import(".prisma/client").$Enums.WallpaperStatus;
    }>;
    update(id: number, dto: UpdateWallpaperDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        tags: string[];
        imageUrl: string;
        thumbnailUrl: string | null;
        categoryId: number | null;
        status: import(".prisma/client").$Enums.WallpaperStatus;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        tags: string[];
        imageUrl: string;
        thumbnailUrl: string | null;
        categoryId: number | null;
        status: import(".prisma/client").$Enums.WallpaperStatus;
    }>;
}
