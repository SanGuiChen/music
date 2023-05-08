import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';

@Entity()
export class ThumbUp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  songId: string;

  @Column({ type: 'bigint', unsigned: true })
  commentId: number;

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
