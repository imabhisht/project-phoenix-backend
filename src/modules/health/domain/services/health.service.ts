import { Injectable, Logger } from '@nestjs/common';
import { HealthEntity } from '../entities/health.entity';
import { HealthEventEntity } from '../entities/healthEvent.entity';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  getHealthStatus(): HealthEntity {
    try {
      const healthEntity = HealthEntity.create();
      
      // Create a health check event
      const healthEvent = HealthEventEntity.create('HEALTH_CHECK', {
        status: healthEntity.status,
        uptime: healthEntity.uptime,
      });

      // Log health check event at debug level (developer info)
      this.logger.debug(
        `Health check event: ${JSON.stringify({
          eventType: healthEvent.eventType,
          status: healthEvent.metadata.status,
          uptime: healthEvent.metadata.uptime,
        })}`,
      );

      return healthEntity;
    } catch (error) {
      this.logger.error('Failed to get health status', error.stack);
      throw error;
    }
  }

  checkDatabaseHealth(): boolean {
    // Placeholder for database health check
    // In a real application, you would check database connectivity here
    this.logger.debug('Checking database health...');
    return true;
  }

  checkExternalServicesHealth(): boolean {
    // Placeholder for external services health check
    // In a real application, you would check external service connectivity here
    this.logger.debug('Checking external services health...');
    return true;
  }
}
