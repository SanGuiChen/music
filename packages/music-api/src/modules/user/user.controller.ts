import { Controller, Post } from '@nestjs/common';
import { SearchUserDto } from './dtos/search.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('search')
  async search(params: SearchUserDto) {
    return this.userService.searchUser(params);
  }
}
