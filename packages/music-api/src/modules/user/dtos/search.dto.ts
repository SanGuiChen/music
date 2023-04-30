import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  RoleEnum,
  UserStatusEnum,
} from 'processors/database/entities/user.entity';

export class SearchUserDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum;

  @IsEnum(UserStatusEnum)
  @IsOptional()
  status?: UserStatusEnum;
}
