import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'processors/database/entities/task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task_User_Mapping } from 'processors/database/entities/task_user_mapping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Task_User_Mapping])],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
