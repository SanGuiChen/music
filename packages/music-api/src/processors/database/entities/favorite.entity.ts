import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

export enum FavoriteSourceEnum {
  OP = 'OP',
  NETEASE = 'NETEASE',
}

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  songId: string;

  @Column({ type: 'enum', enum: FavoriteSourceEnum })
  source: FavoriteSourceEnum;

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
