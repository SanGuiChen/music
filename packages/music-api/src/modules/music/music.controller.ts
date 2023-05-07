import { Body, Controller, Post } from '@nestjs/common';
import { SearchFavoriteDto } from './dtos/search.dto';
import { MusicService } from './music.service';
import { CreateFavoriteDto } from './dtos/create.dto';
import { DeleteFavoriteDto } from './dtos/delete.dto';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post('search/favorite')
  async searchFavorite(@Body() searchDto: SearchFavoriteDto) {
    return this.musicService.search(searchDto);
  }

  @Post('create/favorite')
  async createFavorite(@Body() createDto: CreateFavoriteDto) {
    return this.musicService.create(createDto);
  }

  @Post('delete/favorite')
  async deleteFavorite(@Body() deleteDto: DeleteFavoriteDto) {
    return this.musicService.delete(deleteDto);
  }
}
