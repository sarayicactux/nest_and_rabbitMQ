import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as Models from '../models/index';

@Injectable()
export class UserService {
  secretKey: string = 'd3d$dg^23dDh5dfG44*&';
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly rabbitMQClient: ClientProxy,
  ) {}
  async register(
    username: string,
    password: string,
    name: string,
    lastName: string,
  ): Promise<Models.User> {
    const user = await Models.User.findOne({ where: { username } });
    if (user) {
      throw 'Username already exists';
    }
    const result = await this.rabbitMQClient
      .send('sign_token', {
        tokenValues: {
          username,
          password,
          name,
          lastName,
        },
        secretKey: this.secretKey,
        expiresIn: 60 * 60 * 24,
      })
      .toPromise();
    if (result.status !== 200) {
      throw ' error in signer ';
    }
    const newUser = await Models.User.create({
      username,
      password,
      name,
      lastName,
      token: result.data.token,
    });

    return newUser;
  }

  async login(username: string, password: string): Promise<Models.User | null> {
    const user = await Models.User.findOne({ where: { username, password } });
    if (!user) {
      throw 'Login faild';
    }
    const result = await this.rabbitMQClient
      .send('sign_token', {
        tokenValues: {
          username: user.username,
          password: user.password,
          name: user.name,
          lastName: user.lastName,
        },
        secretKey: this.secretKey,
        expiresIn: 60 * 60 * 24,
      })
      .toPromise();
    if (result.status !== 200) {
      throw ' error in signer ';
    }
    user.token = result.data.token;
    return user;
  }
  async getUser(token: string) {
    const result = await this.rabbitMQClient
      .send('verify_token', {
        token,
        secretKey: this.secretKey,
      })
      .toPromise();
    if (result.status !== 200) {
      throw ' error in signer ';
    }
    const user = result.data;
    user.token = token;
    return user;
  }
}
