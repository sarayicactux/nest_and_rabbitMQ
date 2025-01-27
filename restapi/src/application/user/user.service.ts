import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import Result from '../../interfaces/result.interface';
//DTOs
import {
  UserDto,
  UserLoginDto,
  CreateUserDto,
  userObj,
} from '../../DTO/user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly rabbitMQClient: ClientProxy,
  ) {}
  // login ***************************************************
  async login(userLoginDto: UserLoginDto): Promise<UserDto> {
    const result: Result = await this.rabbitMQClient
      .send('login_user', userLoginDto)
      .toPromise();
    if (result.status === 200) {
      return userObj(result.data);
    } else {
      throw new HttpException(
        {
          status: result.status,
          error: result.error,
        },
        result.status,
      );
    }
  }
  // register ***************************************************
  async register(createUserDto: CreateUserDto): Promise<UserDto> {
    const result: Result = await this.rabbitMQClient
      .send('register_user', createUserDto)
      .toPromise();
    if (result.status === 200) {
      return userObj(result.data);
    } else {
      throw new HttpException(
        {
          status: result.status,
          error: result.error,
        },
        result.status,
      );
    }
  }
  // get user ***************************************************
  async getUser(token: string): Promise<UserDto> {
    if (!token) {
      throw new HttpException(
        {
          status: 403,
          error: 'invalid token',
        },
        403,
      );
    }
    const result: Result = await this.rabbitMQClient
      .send('get_user', token)
      .toPromise();
    if (result.status === 200) {
      return userObj(result.data);
    } else {
      throw new HttpException(
        {
          status: result.status,
          error: result.error,
        },
        result.status,
      );
    }
  }
}
