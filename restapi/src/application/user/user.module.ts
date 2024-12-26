import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RabbitMQModule } from '../../rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
