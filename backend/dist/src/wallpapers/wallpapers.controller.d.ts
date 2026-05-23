import { WallpapersService } from './wallpapers.service';
import { CreateWallpaperDto } from './dto/create-wallpaper.dto';
import { UpdateWallpaperDto } from './dto/update-wallpaper.dto';
import { QueryWallpaperDto } from './dto/query-wallpaper.dto';
export declare class WallpapersController {
    private readonly wallpapersService;
    constructor(wallpapersService: WallpapersService);
    create(dto: CreateWallpaperDto, file: Express.Multer.File): Promise<{
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
    findOne(id: string): Promise<{
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
    update(id: string, dto: UpdateWallpaperDto): Promise<{
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
    remove(id: string): Promise<{
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
