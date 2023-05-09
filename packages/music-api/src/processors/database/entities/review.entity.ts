import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ReviewStatusEnum {
  NOT_START = 0,
  NOT_PASS = 1,
  PASS = 2,
}

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '审核人Id' })
  reviewerId: string;

  @Column({ comment: '接单人Id' })
  employeeId: string;

  @Column({ comment: '任务Id' })
  taskId: string;

  @Column({ type: 'text', nullable: true, comment: '歌词' })
  lyric?: string;

  @Column({ comment: '播放Url', nullable: true })
  playUrl?: string;

  @Column({
    type: 'enum',
    enum: ReviewStatusEnum,
    default: ReviewStatusEnum.NOT_START,
    comment: '审核状态',
  })
  status: ReviewStatusEnum;

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

  @Column({ nullable: true })
  extra?: string;
}
