import { MusicObject } from './../../processors/database/entities/object.entity';
import { ScriptService } from './script.service';
import { Module } from '@nestjs/common';
import { ScriptController } from './script.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManageModule } from 'modules/manage/manage.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  providers: [ScriptService],
  controllers: [ScriptController],
})
export class ScriptModule {}
