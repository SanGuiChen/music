import { CustomError } from '../../errors/custom.error';
import { UserUpdateDto } from './dtos/user-update.dto';
import { UserRegisterDto } from './dtos/user-register.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from 'processors/database/entities/user.entity';
import { decodeMD5 } from 'transformers/codec.transformer';
import { omit } from 'lodash';

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
        omit(userUpdateDto, ['email']),
      );
    } catch (e) {
      throw new CustomError('Register User Failed');
    }
  }
}
