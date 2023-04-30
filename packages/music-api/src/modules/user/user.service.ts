import { CustomError } from '../../errors/custom.error';
import { UserUpdateDto } from './dtos/user-update.dto';
import { UserRegisterDto } from './dtos/user-register.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from 'processors/database/entities/user.entity';
import { decodeMD5 } from 'transformers/codec.transformer';
import { omit } from 'lodash';
import { SearchUserDto } from './dtos/search.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(findData: FindOptionsWhere<User>): Promise<User | null> {
    try {
      return this.userRepository.findOneBy(findData);
    } catch (e) {
      throw new CustomError('ERROR Incorrect username or password');
    }
  }

  async searchUser(params: SearchUserDto) {
    try {
      return this.userRepository.find({
        order: { createTime: 'DESC' },
        where: {
          ...params,
        },
      });
    } catch (e) {
      throw new CustomError('ERROR can not find user');
    }
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

  async updateUser(userUpdateDto: UserUpdateDto) {
    try {
      return await this.userRepository.update(
        { id: userUpdateDto.id },
        omit(userUpdateDto, ['id']),
      );
    } catch (e) {
      throw new CustomError('Update User Failed');
    }
  }
}
