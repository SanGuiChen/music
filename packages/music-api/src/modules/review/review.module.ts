import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'processors/database/entities/review.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TaskModule } from 'modules/task/task.module';
import { ManageModule } from 'modules/manage/manage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), TaskModule, ManageModule],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
