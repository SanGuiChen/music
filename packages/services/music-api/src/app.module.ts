import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '124.223.75.177',
      port: 3306,
      username: 'music',
      password: '123456',
      database: 'music',
      entities: ['./entities/*.entity.ts'],
      synchronize: true, // 设置 synchronize: true 不能被用于生产环境，否则您可能会丢失生产环境数据,
      entityPrefix: 'music_',
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
