import { HttpStatus } from '@nestjs/common';

export interface IAppException {
  errorCode: number;
  responseStatusCode: HttpStatus;
  userErrorText: string;
  developerErrorText: string;
}

export class AppException extends Error implements IAppException {
  errorCode: number;
  responseStatusCode: HttpStatus;
  userErrorText: string;
  developerErrorText: string;
  name: string;
  message: string;

  constructor(
    appException: IAppException,
    developerErrorText?: string,
    userErrorText?: string,
  ) {
    super();
    this.errorCode = appException.errorCode;
    this.responseStatusCode = appException.responseStatusCode;
    this.userErrorText = userErrorText || appException.userErrorText;
    this.developerErrorText =
      developerErrorText || appException.developerErrorText;
    this.name = 'AppException';
    this.message = this.developerErrorText;
  }
}
