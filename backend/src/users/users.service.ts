import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: { id: true, username: true, role: true, createdAt: true, updatedAt: true },
    });
    return users;
  }

  async create(username: string, password: string, role?: Role) {
    const existing = await this.findByUsername(username);
    if (existing) {
      throw new ConflictException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { username, password: hashedPassword, role },
    });
    const { password: _, ...result } = user;
    return result;
  }

  async update(id: number, data: { username?: string; password?: string; confirmPassword?: string; role?: Role }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (data.username && data.username !== user.username) {
      const existing = await this.findByUsername(data.username);
      if (existing) {
        throw new ConflictException('用户名已存在');
      }
    }

    if (data.password) {
      if (!data.confirmPassword || data.password !== data.confirmPassword) {
        throw new BadRequestException('两次输入的密码不一致');
      }
    }

    const updateData: any = {};
    if (data.username) updateData.username = data.username;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    if (data.role) updateData.role = data.role;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    await this.prisma.user.delete({ where: { id } });
    return { message: '删除成功' };
  }
}
