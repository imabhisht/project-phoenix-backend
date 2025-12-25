import { APIErrorResponse } from '../exceptions/apiErrorResponse.dto';

export type EmptyAPIResponse = Record<string, never>;

export class APIResponse<T> {
  success: boolean;
  data: any;
  errorObject: APIErrorResponse | null;

  SuccessResult(data: T): APIResponse<T> {
    this.success = true;
    this.data = data;
    this.errorObject = null;

    return this;
  }

  ErrorResult(
    errorCode: number,
    userErrorText: string,
    developerErrorText: string,
  ): APIResponse<any> {
    this.success = false;
    this.data = {};
    this.errorObject = new APIErrorResponse(
      errorCode,
      userErrorText,
      developerErrorText,
    );

    return this;
  }
}
