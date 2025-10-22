import { Module } from '@nestjs/common';
import { SecretariatService } from './secretariat.service';
import { SecretariatController } from './secretariat.controller';

@Module({
  controllers: [SecretariatController],
  providers: [SecretariatService],
})
export class SecretariatModule {}
