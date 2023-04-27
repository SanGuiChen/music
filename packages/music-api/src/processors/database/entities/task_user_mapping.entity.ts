import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatusEnum } from './task.entity';

@Entity()
export class Task_User_Mapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '任务Id' })
  taskId: string;

  @Column({ comment: '用户Id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: TaskStatusEnum,
    default: TaskStatusEnum.PENDING,
    comment: '任务状态',
  })
  status: TaskStatusEnum;

  @Column({ nullable: true })
  createTime: Date;

  @Column({ nullable: true })
  updateTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @BeforeInsert()
  setCreateTime() {
    this.createTime = new Date();
  }

  @BeforeUpdate()
  setUpdateTime() {
    this.updateTime = new Date();
  }
}
