import { IsString, IsOptional, MinLength, MaxLength, Matches, IsEnum, ValidateIf, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: '用户名', minLength: 3, maxLength: 20 })
  @IsString()
  @IsOptional()
  @MinLength(3, { message: '用户名长度不能少于3位' })
  @MaxLength(20, { message: '用户名长度不能超过20位' })
  @Matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
    message: '用户名只能包含字母、数字、下划线，且不能以数字开头',
  })
  username?: string;

  @ApiPropertyOptional({ description: '新密码', minLength: 6, maxLength: 32 })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: '密码长度不能少于6位' })
  @MaxLength(32, { message: '密码长度不能超过32位' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: '密码必须包含至少一个大写字母、一个小写字母和一个数字',
  })
  password?: string;

  @ApiPropertyOptional({ description: '确认新密码' })
  @IsString()
  @ValidateIf((o) => !!o.password)
  @IsNotEmpty({ message: '修改密码时必须提供确认密码' })
  confirmPassword?: string;

  @ApiPropertyOptional({ description: '角色', enum: Role })
  @IsEnum(Role, { message: '角色只能是 ADMIN 或 USER' })
  @IsOptional()
  role?: Role;
}