import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './shared/filters';

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

  // Enable global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  logger.debug('Global validation pipe enabled');

  // Enable cookie-parser for JWT cookie-based auth
  app.use(cookieParser());
  logger.debug('Cookie-parser middleware enabled');

  // Enable global exception filter for standardized error responses
  app.useGlobalFilters(new HttpExceptionFilter());
  logger.debug('Global exception filter enabled');

  // Enable CORS if needed
  app.enableCors();

  // Enable graceful shutdown
  app.enableShutdownHooks();

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
