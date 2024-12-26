import { Module } from '@nestjs/common';
import { UserModule } from './application/user/user.module';
import { RabbitMQModule } from './rabbitmq.module';

@Module({
  imports: [RabbitMQModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
