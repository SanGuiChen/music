import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'processors/database/entities/favorite.entity';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dtos/createFavorite.dto';
import { CustomError } from 'errors/custom.error';
import { SearchFavoriteDto } from './dtos/searchFavorite.dto';
import { DeleteFavoriteDto } from './dtos/deleteFavorite.dto';
import { HttpBadRequestError } from 'errors/bad-request.error';
import { ThumbUp } from 'processors/database/entities/thumbup.entity';
import { SearchThumbUpDto } from './dtos/searchThumbUp';
import { CreateThumbUpDto } from './dtos/createThumbUp';
import { DeleteThumbUpDto } from './dtos/deleteThumbUp';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(ThumbUp)
    private readonly thumbUpRepository: Repository<ThumbUp>,
  ) {}

  async searchFavorite(params: SearchFavoriteDto) {
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

  async createFavorite(params: CreateFavoriteDto) {
    const object = this.favoriteRepository.create(params);
    try {
      const review = await this.favoriteRepository.save(object);
      return review;
    } catch (e) {
      throw new CustomError('Favorite Create Failed');
    }
  }

  async deleteFavorite(params: DeleteFavoriteDto) {
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

  async searchThumbUp(params: SearchThumbUpDto) {
    const { userId, songId } = params;
    try {
      const [thumbUps, total] = await this.thumbUpRepository.findAndCount({
        where: {
          userId,
          songId,
        },
      });
      return {
        thumbUps,
        total,
      };
    } catch (e) {
      throw new CustomError('ERROR can not find ThumbUp');
    }
  }

  async createThumbUp(params: CreateThumbUpDto) {
    const object = this.thumbUpRepository.create(params);
    try {
      const ThumbUp = await this.thumbUpRepository.save(object);
      return ThumbUp;
    } catch (e) {
      console.error(e);
      throw new CustomError('ThumbUp Create Failed');
    }
  }

  async deleteThumbUp(params: DeleteThumbUpDto) {
    const { id, commentId, userId } = params;
    const searchParams: Record<string, string | number> = {};
    if (id) {
      searchParams.id = id;
    } else if (commentId && userId) {
      searchParams.commentId = commentId;
      searchParams.userId = userId;
    } else {
      throw new HttpBadRequestError(
        'Parameter must have id or userId and commentId ',
      );
    }

    try {
      const object = await this.thumbUpRepository.findOne({
        where: searchParams,
      });
      return await this.thumbUpRepository.remove(object);
    } catch (e) {
      throw new CustomError('ThumbUp Delete Failed');
    }
  }
}
