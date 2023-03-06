import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MusicObject,
  MusicObjectStatusEnum,
} from 'processors/database/entities/object.entity';
import { Like, Repository } from 'typeorm';
import { SearchDto } from './dtos/search.dto';
import { CustomError } from 'errors/custom.error';

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
        songName: item?.songName ? Like(`%${item.songName}%`) : undefined,
        albumName: item?.albumName ? Like(`%${item.albumName}%`) : undefined,
        artistName: item?.artistName ? Like(`%${item.artistName}%`) : undefined,
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
}
