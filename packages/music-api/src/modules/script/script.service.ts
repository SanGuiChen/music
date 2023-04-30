import { MusicObject } from './../../processors/database/entities/object.entity';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ScriptService {
  private scriptHost: string;
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
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
}
