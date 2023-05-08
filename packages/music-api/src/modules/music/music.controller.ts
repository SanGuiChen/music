import { Body, Controller, Post } from '@nestjs/common';
import { SearchFavoriteDto } from './dtos/searchFavorite.dto';
import { MusicService } from './music.service';
import { CreateFavoriteDto } from './dtos/createFavorite.dto';
import { DeleteFavoriteDto } from './dtos/deleteFavorite.dto';
import { DeleteThumbUpDto } from './dtos/deleteThumbUp';
import { CreateThumbUpDto } from './dtos/createThumbUp';
import { SearchThumbUpDto } from './dtos/searchThumbUp';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post('search/favorite')
  async searchFavorite(@Body() searchDto: SearchFavoriteDto) {
    return this.musicService.searchFavorite(searchDto);
  }

  @Post('create/favorite')
  async createFavorite(@Body() createDto: CreateFavoriteDto) {
    return this.musicService.createFavorite(createDto);
  }

  @Post('delete/favorite')
  async deleteFavorite(@Body() deleteDto: DeleteFavoriteDto) {
    return this.musicService.deleteFavorite(deleteDto);
  }

  @Post('search/thumbUp')
  async searchThumbUp(@Body() searchDto: SearchThumbUpDto) {
    return this.musicService.searchThumbUp(searchDto);
  }

  @Post('create/thumbUp')
  async createThumbUp(@Body() createDto: CreateThumbUpDto) {
    return this.musicService.createThumbUp(createDto);
  }

  @Post('delete/thumbUp')
  async deleteThumbUp(@Body() deleteDto: DeleteThumbUpDto) {
    return this.musicService.deleteThumbUp(deleteDto);
  }
}
