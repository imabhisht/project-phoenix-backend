import { HttpStatus } from '@nestjs/common';
import { AppException } from './appException';

export class CommonErrorModels {
  static FORBIDDEN_REQUEST = new AppException({
    errorCode: -1,
    responseStatusCode: HttpStatus.FORBIDDEN,
    developerErrorText: 'Forbidden Request',
    userErrorText: 'Access forbidden',
  });

  static INTERNAL_SERVER_ERROR = new AppException({
    errorCode: -2,
    responseStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    developerErrorText: 'Internal Server Error',
    userErrorText: 'An unexpected error occurred',
  });

  static BAD_REQUEST = new AppException({
    errorCode: -3,
    responseStatusCode: HttpStatus.BAD_REQUEST,
    developerErrorText: 'Bad Request',
    userErrorText: 'Invalid request parameters',
  });

  static UNAUTHORIZED = new AppException({
    errorCode: -4,
    responseStatusCode: HttpStatus.UNAUTHORIZED,
    developerErrorText: 'Unauthorized',
    userErrorText: 'Authentication required',
  });

  static NOT_FOUND = new AppException({
    errorCode: -5,
    responseStatusCode: HttpStatus.NOT_FOUND,
    developerErrorText: 'Resource Not Found',
    userErrorText: 'The requested resource was not found',
  });
}
