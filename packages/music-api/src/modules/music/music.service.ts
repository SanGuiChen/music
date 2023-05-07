import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'processors/database/entities/favorite.entity';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dtos/create.dto';
import { CustomError } from 'errors/custom.error';
import { SearchFavoriteDto } from './dtos/search.dto';
import { DeleteFavoriteDto } from './dtos/delete.dto';
import { HttpBadRequestError } from 'errors/bad-request.error';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async search(params: SearchFavoriteDto) {
    const { userId } = params;
    try {
      const [songs, total] = await this.favoriteRepository.findAndCount({
        order: { createTime: 'DESC' },
        where: {
          userId,
        },
      });
      return {
        songs,
        total,
      };
    } catch (e) {
      throw new CustomError('ERROR can not find favorite songs');
    }
  }

  async create(params: CreateFavoriteDto) {
    const object = this.favoriteRepository.create(params);
    try {
      const review = await this.favoriteRepository.save(object);
      return review;
    } catch (e) {
      throw new CustomError('Favorite Create Failed');
    }
  }

  async delete(params: DeleteFavoriteDto) {
    const { id, songId, userId } = params;
    const searchParams: Record<string, string> = {};
    if (id) {
      searchParams.id = id;
    } else if (songId && userId) {
      searchParams.songId = songId;
      searchParams.userId = userId;
    } else {
      throw new HttpBadRequestError(
        'Parameter must have id or userId and songId ',
      );
    }

    try {
      const object = await this.favoriteRepository.findOne({
        where: searchParams,
      });
      return await this.favoriteRepository.remove(object);
    } catch (e) {
      throw new CustomError('Favorite Song Delete Failed');
    }
  }
}
