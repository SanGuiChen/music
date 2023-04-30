import { ManageService } from './manage.service';
import { ManageController } from './manage.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicObject } from 'processors/database/entities/object.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MusicObject])],
  providers: [ManageService],
  exports: [ManageService],
  controllers: [ManageController],
})
export class ManageModule {}
