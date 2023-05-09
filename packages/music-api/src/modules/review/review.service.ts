import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Review,
  ReviewStatusEnum,
} from 'processors/database/entities/review.entity';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateReviewDto } from './dtos/create.dto';
import { SearchReviewDto } from './dtos/search.dto';
import { isEmpty, omit, uniqueId } from 'lodash';
import { CustomError } from 'errors/custom.error';
import { SubmitReviewDto } from './dtos/submit.dto';
import { TaskService } from 'modules/task/task.service';
import { ManageService } from 'modules/manage/manage.service';
import { TaskTypeEnum } from 'processors/database/entities/task.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly taskService: TaskService,
    private readonly manageService: ManageService,
  ) {}

  async search(params: SearchReviewDto) {
    const { offset, limit, createTime, status, ...others } = params;
    try {
      const [reviews, total] = await this.reviewRepository.findAndCount({
        order: { createTime: 'DESC' },
        where: {
          ...others,
          status: status && !isEmpty(status) ? In(status) : undefined,
          createTime: createTime
            ? MoreThanOrEqual(new Date(createTime))
            : undefined,
        },
        skip: offset,
        take: limit,
      });
      return {
        reviews,
        total,
      };
    } catch (e) {
      throw new CustomError('ERROR can not find task');
    }
  }

  async create(params: CreateReviewDto) {
    const reviewObject = this.reviewRepository.create(params);
    try {
      const review = await this.reviewRepository.save(reviewObject);
      await this.taskService.pendingReviewTask(params.taskId);
      return review;
    } catch (e) {
      throw new CustomError('Task Create Failed');
    }
  }

  // 审核通过 -> 状态变更 -> 入库 -> 后续是不是可以打钱...
  async submit(params: SubmitReviewDto) {
    const { id } = params;
    try {
      const updateRes = await this.reviewRepository.update(
        { id },
        { status: ReviewStatusEnum.PASS },
      );
      const reviews = await this.reviewRepository.find({
        where: { id },
        order: { createTime: 'DESC' },
      });
      const review = reviews[0];
      const { taskId, lyric: diyLyric, playUrl: diyUrl } = review;
      // task状态更新为已完成
      await this.taskService.finishTask(taskId);
      const task = (
        await this.taskService.searchTask({ id: taskId, offset: 0, limit: 1 })
      )[0];
      // 如果是LRC 先入库
      // 其他类型待定
      if (task.type === TaskTypeEnum.LRC) {
        if (task?.extra) {
          const { songName, artistName, albumName, lyric, playUrl } =
            JSON.parse(task.extra);
          const songId = uniqueId(new Date().valueOf().toString());
          const artistId = uniqueId(new Date().valueOf().toString());
          const albumId = uniqueId(new Date().valueOf().toString());
          await this.manageService.storage({
            songId,
            songName,
            artistId,
            artistName,
            albumId,
            albumName,
            playUrl: diyUrl ? diyUrl : playUrl,
            lyric: diyLyric ? diyLyric : lyric,
          });
        }
      }
      return updateRes;
    } catch (e) {
      Logger.error(e);
      throw new CustomError(e);
    }
  }

  // 审核不通过 -> 状态变更 -> 任务打回 -> 任务状态变更为进行中（如果已经超时 那就直接任务失败）
  async reject(params: SubmitReviewDto) {
    const { id } = params;
    try {
      const updateRes = await this.reviewRepository.update(
        { id },
        { status: ReviewStatusEnum.NOT_PASS },
      );
      const reviews = await this.reviewRepository.find({
        where: { id },
        order: { createTime: 'DESC' },
      });
      const review = reviews[0];
      const { taskId } = review;
      await this.taskService.backToTask(taskId);
      return updateRes;
    } catch (e) {
      throw new CustomError('Review Reject Failed');
    }
  }
}
