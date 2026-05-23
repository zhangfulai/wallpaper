import { IsString, IsNotEmpty, MinLength, MaxLength, Matches, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ description: '用户名', minLength: 3, maxLength: 20 })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名长度不能少于3位' })
  @MaxLength(20, { message: '用户名长度不能超过20位' })
  @Matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
    message: '用户名只能包含字母、数字、下划线，且不能以数字开头',
  })
  username: string;

  @ApiProperty({ description: '密码', minLength: 6, maxLength: 32 })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能少于6位' })
  @MaxLength(32, { message: '密码长度不能超过32位' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: '密码必须包含至少一个大写字母、一个小写字母和一个数字',
  })
  password: string;

  @ApiProperty({ description: '确认密码' })
  @IsString()
  @IsNotEmpty({ message: '确认密码不能为空' })
  confirmPassword: string;

  @ApiProperty({ description: '角色', enum: Role, default: Role.USER })
  @IsEnum(Role, { message: '角色只能是 ADMIN 或 USER' })
  role: Role;
}
