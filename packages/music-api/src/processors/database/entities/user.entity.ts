import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  nickname: string;

  @Column({ comment: '用户名(邮箱格式)' })
  email: string;

  @Exclude()
  @Column({ comment: '密码' })
  password: string;

  @Column({ comment: '头像', nullable: true })
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

  @Column({ nullable: true })
  createTime: Date;

  @Column({ nullable: true })
  updateTime: Date;

  @BeforeInsert()
  setCreateTime() {
    this.createTime = new Date();
  }

  @BeforeUpdate()
  setUpdateTime() {
    this.updateTime = new Date();
  }
}
