import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // Create app with logger enabled
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('SystemOptions.port') || 3000;

  // Log configuration details at debug level
  logger.debug(`Port configured: ${port}`);
  logger.debug('Initializing application...');

  // Enable CORS if needed
  app.enableCors();
  logger.debug('CORS enabled');

  // Global prefix for all routes
  app.setGlobalPrefix('api');
  logger.debug('Global prefix set to: /api');

  // Enable graceful shutdown
  app.enableShutdownHooks();
  logger.debug('Shutdown hooks enabled');

  await app.listen(port);
  
  // Log startup information at info level
  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
  logger.log(`📊 Health check available at: http://localhost:${port}/api/health`);
  logger.log('Application started successfully');
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application', error.stack);
  process.exit(1);
});
