import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserStatusEnum {
  BANNED = 0,
  IN_USE = 1,
}

export enum RoleEnum {
  SUPER_ADMIN = 1,
  USER = 2,
  GUEST = 3,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 45, comment: '昵称' })
  nickName: string;

  @Column({ comment: '用户名(邮箱格式)' })
  email: string;

  @Column({ comment: '密码' })
  passWord: string;

  @Column({ comment: '头像' })
  avatar: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
    comment: '用户角色',
  })
  role: RoleEnum;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.IN_USE,
    comment: '账号状态',
  })
  status: UserStatusEnum;
}
