import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RabbitMQModule } from '../rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
