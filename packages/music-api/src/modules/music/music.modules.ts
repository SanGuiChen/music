import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from 'processors/database/entities/favorite.entity';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { ThumbUp } from 'processors/database/entities/thumbup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, ThumbUp])],
  providers: [MusicService],
  controllers: [MusicController],
})
export class MusicModule {}
