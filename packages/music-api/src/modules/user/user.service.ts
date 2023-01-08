import { CustomError } from '../../errors/custom.error';
import { UserUpdateDto } from './dtos/user-update.dto';
import { UserRegisterDto } from './dtos/user-register.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'processors/database/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(findData: FindOptionsWhere<User>): Promise<User | null> {
    return this.userRepository.findOneBy(findData);
  }

  async createUser(
    userRegisterDto: UserRegisterDto,
  ): Promise<Omit<User, 'passWord'>> {
    console.log(userRegisterDto);
    const user = this.userRepository.create(userRegisterDto);

    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw new CustomError('Register User Failed');
    }
    return _.omit(user, ['passWord']);
  }

  async modifyUser(userUpdateDto: UserUpdateDto): Promise<UserUpdateDto> {
    try {
      await this.userRepository.update(
        { email: userUpdateDto.email },
        _.omit(userUpdateDto, ['email']),
      );
    } catch (e) {
      throw new CustomError('Register User Failed');
    }
    return userUpdateDto;
  }
}
