import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, MoreThanOrEqual, Repository } from 'typeorm';
import { Task } from 'processors/database/entities/task.entity';
import { CustomError } from 'errors/custom.error';
import { SearchDto } from './dtos/search.dto';
import { CreateDto } from './dtos/create.dto';
import { Task_User_Mapping } from 'processors/database/entities/task_user_mapping.entity';
import { ClaimDto } from './dtos/claim.dto';
import { TaskStatusEnum } from 'processors/database/entities/task.entity';
import { isEmpty } from 'lodash';
import { SearchPersonalTaskDto } from './dtos/search_personal.dto';

// Todo：更新和编辑 需要和权限一起
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Task_User_Mapping)
    private taskUserMapRepository: Repository<Task_User_Mapping>,
  ) {}

  async searchTask(params: SearchDto) {
    const {
      offset,
      limit,
      name,
      timeLimit,
      reward,
      createTime,
      id,
      type,
      status,
    } = params;
    try {
      return this.taskRepository.find({
        order: { createTime: 'DESC' },
        where: {
          id,
          type: type && !isEmpty(type) ? In(type) : undefined,
          status: status && !isEmpty(status) ? In(status) : undefined,
          name: name ? ILike(`%${name}%`) : undefined,
          timeLimit: timeLimit ? MoreThanOrEqual(timeLimit) : undefined,
          createTime: createTime
            ? MoreThanOrEqual(new Date(createTime))
            : undefined,
          reward: reward ? MoreThanOrEqual(reward) : undefined,
        },
        skip: offset,
        take: limit,
      });
    } catch (e) {
      throw new CustomError('ERROR can not find task');
    }
  }

  async searchPersonalTask(params: SearchPersonalTaskDto) {
    const { offset, limit, userId, taskId } = params;
    try {
      const personalTasks = await this.taskUserMapRepository.find({
        where: {
          userId,
          taskId,
        },
      });
      const taskIds = personalTasks.map((task) => task.taskId);
      const [tasks, total] = await this.taskRepository.findAndCount({
        where: {
          id: In(taskIds),
        },
        skip: offset,
        take: limit,
        order: { createTime: 'DESC' },
      });
      return {
        task: tasks,
        personalTask: personalTasks,
        total,
      };
    } catch (e) {
      throw new CustomError('ERROR can not find personal task');
    }
  }

  async createTask(params: CreateDto) {
    const task = this.taskRepository.create(params);
    try {
      return await this.taskRepository.save(task);
    } catch (e) {
      throw new CustomError('Task Create Failed');
    }
  }

  async claimTask(params: ClaimDto) {
    const taskUserMap = this.taskUserMapRepository.create(params);

    try {
      const user_task = await this.taskUserMapRepository.save(taskUserMap);
      await this.taskRepository.update(
        { id: params.taskId },
        { status: TaskStatusEnum.PENDING },
      );

      return user_task;
    } catch (e) {
      throw new CustomError('Task User Map Create Failed');
    }
  }

  async finishTask(taskId: string) {
    try {
      return await this.taskRepository.update(
        { id: taskId },
        { status: TaskStatusEnum.FINISHED },
      );
    } catch (e) {
      throw new CustomError('Task Status Update Failed');
    }
  }

  async backToTask(taskId: string) {
    try {
      return await this.taskRepository.update(
        { id: taskId },
        { status: TaskStatusEnum.CHECK_REJECT },
      );
    } catch (e) {
      throw new CustomError('Task Status Update Failed');
    }
  }

  async pendingReviewTask(taskId: string) {
    try {
      return await this.taskRepository.update(
        { id: taskId },
        { status: TaskStatusEnum.CHECK_PENDING },
      );
    } catch (e) {
      throw new CustomError('Task Status Update Failed');
    }
  }
}
