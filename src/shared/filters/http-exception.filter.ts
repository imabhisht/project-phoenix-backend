import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { APIResponse, EmptyAPIResponse } from '../dto';

/**
 * Global HTTP Exception Filter
 * Catches all HTTP exceptions and converts them to standardized APIResponse format
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        // Extract error message
        let userErrorText: string;
        let developerErrorText: string;

        if (typeof exceptionResponse === 'string') {
            userErrorText = exceptionResponse;
            developerErrorText = exceptionResponse;
        } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const responseObj = exceptionResponse as any;

            // Handle validation errors (array of messages)
            if (Array.isArray(responseObj.message)) {
                userErrorText = responseObj.message.join(', ');
                developerErrorText = JSON.stringify(responseObj.message);
            } else {
                userErrorText = responseObj.message || responseObj.error || 'An error occurred';
                developerErrorText = responseObj.message || responseObj.error || exception.message;
            }
        } else {
            userErrorText = 'An unexpected error occurred';
            developerErrorText = exception.message;
        }

        // Log the error
        this.logger.error(
            `HTTP ${status} Error: ${developerErrorText}`,
            exception.stack,
        );

        // Create standardized error response
        const errorResponse = new APIResponse<EmptyAPIResponse>().ErrorResult(
            status,
            userErrorText,
            developerErrorText,
        );

        response.status(status).json(errorResponse);
    }
}
