import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from 'processors/database/entities/favorite.entity';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite])],
  providers: [MusicService],
  controllers: [MusicController],
})
export class MusicModule {}
