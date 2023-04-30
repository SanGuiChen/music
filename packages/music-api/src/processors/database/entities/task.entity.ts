import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TaskTypeEnum {
  LRC = 1,
  KRC = 2,
  ARTIST_INFO = 3,
}

export enum TaskStatusEnum {
  NOT_START = 1,
  PENDING = 2,
  CHECK_PENDING = 3,
  CHECK_REJECT = 4,
  FINISHED = 5,
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '创建人Id' })
  creatorId: string;

  @Column({ length: 45, comment: '任务名' })
  name: string;

  @Column({ comment: '任务类型', type: 'enum', enum: TaskTypeEnum })
  type: TaskTypeEnum;

  @Column({
    type: 'enum',
    enum: TaskStatusEnum,
    default: TaskStatusEnum.NOT_START,
    comment: '任务状态',
  })
  status: TaskStatusEnum;

  @Column({ comment: '限时' })
  timeLimit: number;

  @Column({ comment: '酬劳' })
  reward: number;

  @Column({ nullable: true })
  createTime: Date;

  @Column({ nullable: true })
  updateTime: Date;

  @Column({ nullable: true })
  extra?: string;

  @BeforeInsert()
  setCreateTime() {
    this.createTime = new Date();
  }

  @BeforeUpdate()
  setUpdateTime() {
    this.updateTime = new Date();
  }
}
