import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MusicObject,
  MusicObjectStatusEnum,
} from 'processors/database/entities/object.entity';
import { ILike, Repository } from 'typeorm';
import { SearchDto } from './dtos/search.dto';
import { CustomError } from 'errors/custom.error';
import { StorageDto } from './dtos/storage.dto';

@Injectable()
export class ManageService {
  constructor(
    @InjectRepository(MusicObject)
    private musicObjectRepository: Repository<MusicObject>,
  ) {}

  async search(params: SearchDto) {
    const { objects, offset, limit } = params;
    const [object, count] = await this.musicObjectRepository.findAndCount({
      where: objects?.map((item) => ({
        ...item,
        songName: item?.songName ? ILike(`%${item.songName}%`) : undefined,
        albumName: item?.albumName ? ILike(`%${item.albumName}%`) : undefined,
        artistName: item?.artistName
          ? ILike(`%${item.artistName}%`)
          : undefined,
      })),
      skip: offset,
      take: limit,
    });
    return {
      list: object,
      total: count,
    };
  }

  async offline(id: string) {
    try {
      return await this.musicObjectRepository.update(
        { id },
        { status: MusicObjectStatusEnum.OFFLINE },
      );
    } catch (e) {
      throw new CustomError('Song offline failed');
    }
  }

  async shelves(id: string) {
    try {
      return await this.musicObjectRepository.update(
        { id },
        { status: MusicObjectStatusEnum.IN_USE },
      );
    } catch (e) {
      throw new CustomError('Song shelves failed');
    }
  }

  // 可以完善
  async isStoraged(songId: string, albumId: string, artistId: string) {
    return await this.musicObjectRepository.findOneBy({
      songId,
      albumId,
      artistId,
    });
  }

  async storage(song: StorageDto) {
    const songId = `${song.songId}`;
    const albumId = `${song.albumId}`;
    const artistId = `${song.artistId}`;
    const object = await this.isStoraged(songId, albumId, artistId);
    if (!object) {
      const musicObject = this.musicObjectRepository.create({
        ...song,
        songId,
        albumId,
        artistId,
      });
      try {
        return await this.musicObjectRepository.save(musicObject);
      } catch (e) {
        throw new CustomError('Song storage failed');
      }
    }
  }
}
