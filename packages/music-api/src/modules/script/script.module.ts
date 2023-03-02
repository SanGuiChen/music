import { MusicObject } from './../../processors/database/entities/object.entity';
import { ScriptService } from './script.service';
import { Module } from '@nestjs/common';
import { ScriptController } from './script.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 5000,
    }),
    TypeOrmModule.forFeature([MusicObject]),
  ],
  providers: [ScriptService],
  controllers: [ScriptController],
})
export class ScriptModule {}
