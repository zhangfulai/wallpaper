"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WallpapersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WallpapersService = class WallpapersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, imageUrl) {
        return this.prisma.wallpaper.create({
            data: {
                ...dto,
                imageUrl,
                tags: dto.tags || [],
            },
        });
    }
    async findAll(query) {
        const { page = 1, pageSize = 10, keyword, categoryId, status } = query;
        const skip = (page - 1) * pageSize;
        const where = {};
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
    async findOne(id) {
        const wallpaper = await this.prisma.wallpaper.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!wallpaper) {
            throw new common_1.NotFoundException('壁纸不存在');
        }
        return wallpaper;
    }
    async update(id, dto) {
        await this.findOne(id);
        const data = { ...dto };
        if (dto.tags) {
            data.tags = dto.tags;
        }
        return this.prisma.wallpaper.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.wallpaper.delete({ where: { id } });
    }
};
exports.WallpapersService = WallpapersService;
exports.WallpapersService = WallpapersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WallpapersService);
//# sourceMappingURL=wallpapers.service.js.map