export enum TaskTypeEnum {
  LRC = 1,
  KRC = 2,
  ARTIST_INFO = 3
}

export enum TaskStatusEnum {
  NOT_START = 1,
  PENDING = 2,
  CHECK_PENDING = 3,
  CHECK_REJECT = 4,
  FINISHED = 5
}

export interface ISearchTaskParams {
  id?: string;
  name?: string;
  type?: TaskTypeEnum[];
  status?: TaskStatusEnum[];
  timeLimit?: number;
  reward?: number;
  createTime?: string;
  // updateTime: Date;
  offset: number;
  limit: number;
}

export interface ISearchPersonalTaskParams {
  userId?: string;
  taskId?: string;
  offset: number;
  limit: number;
}

export interface ISearchPersonalTaskResp {
  task: ITask[];
  personalTask: IPersonalTask[];
  total: number;
}

export interface ICreateTaskParams {
  name: string;
  creatorId: string;
  type: TaskTypeEnum;
  timeLimit: number;
  reward: number;
  extra?: string;
}

export interface IClaimTaskParams {
  taskId: string;
  userId: string;
}

export interface ITask {
  id: string;
  creatorId: string;
  name: string;
  type: TaskTypeEnum;
  status: TaskStatusEnum;
  timeLimit: number;
  reward: number;
  createTime: string;
  updateTime: string;
  extra?: string;
}

export interface IPersonalTask {
  id: string;
  taskId: string;
  userId: string;
  status: TaskStatusEnum;
  createTime: string;
  updateTime: string;
  endTime: string;
}
