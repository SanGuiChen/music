import { ScriptModule } from './modules/script/script.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'processors/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ManageModule } from 'modules/manage/manage.module';
import { TaskModule } from 'modules/task/task.module';
import { ReviewModule } from 'modules/review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.dev.env'],
    }),
    DatabaseModule,
    AuthModule,
    ScriptModule,
    ManageModule,
    TaskModule,
    ReviewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
