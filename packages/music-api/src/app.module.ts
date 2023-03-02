import { ScriptModule } from './modules/script/script.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'processors/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.dev.env'],
    }),
    DatabaseModule,
    AuthModule,
    ScriptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
