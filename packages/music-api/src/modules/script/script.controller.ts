import { StorageDto } from './dtos/storage.dto';
import { PlayDto } from './dtos/play.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { map } from 'rxjs';
import { SearchDto } from './dtos/search.dto';
import { ScriptService } from './script.service';

@Controller('script')
export class ScriptController {
  constructor(private readonly scriptService: ScriptService) {}

  @Post('search')
  async searchByKeyWords(@Body() searchDto: SearchDto) {
    const { keyWords, offset, limit } = searchDto;
    return this.scriptService.Search(keyWords, offset, limit).pipe(
      map((res) => ({
        list: res.data?.result?.songs?.map(({ id, name, ar, al }) => ({
          songId: id ?? '-',
          songName: name ?? '-',
          artists:
            ar?.map(({ id, name }) => ({ artistName: name, artistId: id })) ??
            [],
          albumId: !isEmpty(al) ? al?.id ?? '-' : '-',
          albumName: !isEmpty(al) ? al?.name ?? '-' : '-',
          imgUrl: !isEmpty(al) ? al?.picUrl ?? '-' : '-',
          playUrl: '-',
        })),
        total: res.data?.result?.songCount ?? 0,
      })),
    );
  }

  @Post('play/url')
  async getPlayUrls(@Body() playDto: PlayDto) {
    const { songIds } = playDto;
    return this.scriptService.getPlayUrls(songIds).pipe(
      map((res) => {
        const data = res.data?.data ?? [];
        const playMap: Record<string, string> = {};
        data.forEach(({ id, url }) => {
          if (id && url) {
            playMap[id] = url;
          }
        });
        return playMap;
      }),
    );
  }

  @Post('storage')
  async storage(@Body() storageDto: StorageDto) {
    return this.scriptService.storage(storageDto);
  }
}
