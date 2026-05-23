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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WallpapersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const path_1 = require("path");
const wallpapers_service_1 = require("./wallpapers.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const create_wallpaper_dto_1 = require("./dto/create-wallpaper.dto");
const update_wallpaper_dto_1 = require("./dto/update-wallpaper.dto");
const query_wallpaper_dto_1 = require("./dto/query-wallpaper.dto");
const storage = (0, multer_1.diskStorage)({
    destination: './uploads',
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
    },
});
let WallpapersController = class WallpapersController {
    wallpapersService;
    constructor(wallpapersService) {
        this.wallpapersService = wallpapersService;
    }
    create(dto, file) {
        if (!file) {
            throw new common_1.BadRequestException('请上传图片');
        }
        const imageUrl = `/uploads/${file.filename}`;
        return this.wallpapersService.create(dto, imageUrl);
    }
    findAll(query) {
        return this.wallpapersService.findAll(query);
    }
    findOne(id) {
        return this.wallpapersService.findOne(+id);
    }
    update(id, dto) {
        return this.wallpapersService.update(+id, dto);
    }
    remove(id) {
        return this.wallpapersService.remove(+id);
    }
};
exports.WallpapersController = WallpapersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '创建壁纸' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage,
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/image\/(jpeg|png|jpg|gif|webp)/)) {
                return callback(new common_1.BadRequestException('只允许上传图片文件'), false);
            }
            callback(null, true);
        },
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_wallpaper_dto_1.CreateWallpaperDto, Object]),
    __metadata("design:returntype", void 0)
], WallpapersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '获取壁纸列表' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_wallpaper_dto_1.QueryWallpaperDto]),
    __metadata("design:returntype", void 0)
], WallpapersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '获取壁纸详情' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WallpapersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '更新壁纸' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_wallpaper_dto_1.UpdateWallpaperDto]),
    __metadata("design:returntype", void 0)
], WallpapersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '删除壁纸' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WallpapersController.prototype, "remove", null);
exports.WallpapersController = WallpapersController = __decorate([
    (0, swagger_1.ApiTags)('壁纸'),
    (0, common_1.Controller)('wallpapers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [wallpapers_service_1.WallpapersService])
], WallpapersController);
//# sourceMappingURL=wallpapers.controller.js.map