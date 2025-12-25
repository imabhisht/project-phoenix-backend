import { Module } from '@nestjs/common';
import { HealthController } from './application/controllers/health.controller';
import { HealthService } from './domain/services/health.service';
import { HealthRepository } from './repository/health.repository';

@Module({
  controllers: [HealthController],
  providers: [HealthService, HealthRepository],
  exports: [HealthService],
})
export class HealthModule {}
