import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MusicObjectStatusEnum {
  IN_USE = 0,
  OFFLINE = 1,
}

@Entity()
export class MusicObject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '歌曲Id' })
  songId: string;

  @Column({ comment: '歌曲名' })
  songName: string;

  @Column({ comment: '艺人Id' })
  artistId: string;

  @Column({ comment: '艺人名' })
  artistName: string;

  @Column({ comment: '专辑Id' })
  albumId: string;

  @Column({ comment: '专辑名' })
  albumName: string;

  @Column({ comment: '封面', nullable: true })
  imgUrl: string;

  @Column({ type: 'text', comment: '歌词', nullable: true })
  lyric?: string;

  @Column({ comment: '音乐播放url', nullable: true })
  playUrl: string;

  @Column({
    type: 'enum',
    enum: MusicObjectStatusEnum,
    default: MusicObjectStatusEnum.IN_USE,
    comment: '音乐实体状态',
  })
  status: MusicObjectStatusEnum;

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
