import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException } from './appException';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let message: string;
    let errorCode: number | undefined;
    let developerMessage: string;

    if (exception instanceof AppException) {
      // Handle custom AppException
      status = exception.responseStatusCode;
      message = exception.userErrorText;
      errorCode = exception.errorCode;
      developerMessage = exception.developerErrorText;

      // Log error with full details
      this.logger.error(
        `AppException [${errorCode}]: ${developerMessage}`,
        exception.stack,
      );
    } else if (exception instanceof HttpException) {
      // Handle NestJS HttpException
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'An error occurred';
      developerMessage = exception.message;

      // Log error
      this.logger.error(
        `HttpException [${status}]: ${developerMessage}`,
        exception.stack,
      );
    } else if (exception instanceof Error) {
      // Handle generic Error
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      developerMessage = exception.message;

      // Log error with stack trace
      this.logger.error(
        `Unhandled Error: ${developerMessage}`,
        exception.stack,
      );
    } else {
      // Handle unknown exceptions
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      developerMessage = 'Unknown error occurred';

      // Log error
      this.logger.error(`Unknown Exception: ${JSON.stringify(exception)}`);
    }

    // Log request details at debug level
    this.logger.debug(
      `Request: ${request.method} ${request.url} - Status: ${status}`,
    );

    // Send error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(errorCode && { errorCode }),
      ...(process.env.NODE_ENV === 'development' && {
        developerMessage,
      }),
    });
  }
}
