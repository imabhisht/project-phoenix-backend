import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../../domain/services/health.service';
import { APIResponse } from '@core/http/apiResponse.dto';
import { HealthDto } from '../dto/health.dto';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  health(): APIResponse<HealthDto> {
    const healthEntity = this.healthService.getHealthStatus();
    
    const healthDto: HealthDto = {
      status: healthEntity.status,
      uptime: healthEntity.uptime,
      timestamp: healthEntity.timestamp,
      memory: healthEntity.memory,
    };

    return new APIResponse<HealthDto>().SuccessResult(healthDto);
  }
}
