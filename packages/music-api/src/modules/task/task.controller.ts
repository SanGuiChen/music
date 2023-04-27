import { Body, Controller, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { SearchDto } from './dtos/search.dto';
import { CreateDto } from './dtos/create.dto';
import { ClaimDto } from './dtos/claim.dto';
import { SearchPersonalTaskDto } from './dtos/search_personal.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('search/task')
  async searchTask(@Body() searchDto: SearchDto) {
    return this.taskService.searchTask(searchDto);
  }

  @Post('search/personal')
  async searchPersonalTask(@Body() searchPersonalDto: SearchPersonalTaskDto) {
    return this.taskService.searchPersonalTask(searchPersonalDto);
  }

  @Post('create')
  async createTask(@Body() createDto: CreateDto) {
    return this.taskService.createTask(createDto);
  }

  @Post('claim')
  async claimTask(@Body() claimDto: ClaimDto) {
    return this.taskService.claimTask(claimDto);
  }
}
