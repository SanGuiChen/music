import { CustomError } from '../../errors/custom.error';
import { UserUpdateDto } from './dtos/user-update.dto';
import { UserRegisterDto } from './dtos/user-register.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import _ from 'lodash';
import { User } from 'processors/database/entities/user.entity';
import { decodeMD5 } from 'transformers/codec.transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(findData: FindOptionsWhere<User>): Promise<User | null> {
    return this.userRepository.findOneBy(findData);
  }

  async createUser(userRegisterDto: UserRegisterDto) {
    const { password } = userRegisterDto;
    const user = this.userRepository.create({
      ...userRegisterDto,
      password: decodeMD5(password),
    });

    try {
      return await this.userRepository.save(user);
    } catch (e) {
      throw new CustomError('Register User Failed');
    }
  }

  async modifyUser(userUpdateDto: UserUpdateDto) {
    try {
      return await this.userRepository.update(
        { email: userUpdateDto.email },
        _.omit(userUpdateDto, ['email']),
      );
    } catch (e) {
      throw new CustomError('Register User Failed');
    }
  }
}
