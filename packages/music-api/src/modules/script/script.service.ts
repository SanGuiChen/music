import { MusicObject } from './../../processors/database/entities/object.entity';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomError } from 'errors/custom.error';
import { StorageDto } from './dtos/storage.dto';

@Injectable()
export class ScriptService {
  private scriptHost: string;
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @InjectRepository(MusicObject)
    private musicObjectRepository: Repository<MusicObject>,
  ) {
    this.scriptHost =
      this.configService.get('MUSIC_SCRIPT_SERVICE') || 'http//localhost:3001';
  }

  Search(keywords: string[], offset: number, limit: number) {
    const searchUrl = `${this.scriptHost}/cloudsearch`;
    return this.httpService.get(
      `${searchUrl}?keywords=${keywords.join(
        ' ',
      )}&&offset=${offset}&&limit=${limit}`,
    );
  }

  getPlayUrls(songIds: string[]) {
    const url = `${this.scriptHost}/song/url`;
    return this.httpService.get(`${url}?id=${songIds.join(',')}`);
  }

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
    const artistId = song.artistId;
    const object = await this.isStoraged(songId, albumId, artistId);
    if (!object) {
      const musicObject = this.musicObjectRepository.create({
        ...song,
        songId,
        albumId,
      });
      try {
        return await this.musicObjectRepository.save(musicObject);
      } catch (e) {
        throw new CustomError('Song storage failed');
      }
    }
  }
}
