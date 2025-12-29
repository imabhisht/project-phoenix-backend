import { APIErrorResponse } from './api-error-response.dto';

/**
 * Empty API Response type for endpoints that don't return data
 */
export type EmptyAPIResponse = Record<string, never>;

/**
 * Standardized API Response wrapper
 * Generic type T represents the data type for successful responses
 * 
 * Usage:
 * - Success: new APIResponse<YourDataType>().SuccessResult(data)
 * - Error: new APIResponse<EmptyAPIResponse>().ErrorResult(code, userMsg, devMsg)
 */
export class APIResponse<T> {
    success: boolean;
    data: T | EmptyAPIResponse;
    errorObject: APIErrorResponse | null;

    /**
     * Create a successful API response
     * @param data - The data to return in the response
     * @returns APIResponse with success=true and populated data
     */
    SuccessResult(data: T): APIResponse<T> {
        this.success = true;
        this.data = data;
        this.errorObject = null;

        return this;
    }

    /**
     * Create an error API response
     * @param errorCode - HTTP status code or custom error code
     * @param userErrorText - User-friendly error message
     * @param developerErrorText - Detailed error message for debugging
     * @returns APIResponse with success=false and populated error object
     */
    ErrorResult(
        errorCode: number,
        userErrorText: string,
        developerErrorText: string,
    ): APIResponse<EmptyAPIResponse> {
        this.success = false;
        this.data = {} as EmptyAPIResponse;
        this.errorObject = new APIErrorResponse(
            errorCode,
            userErrorText,
            developerErrorText,
        );

        return this as unknown as APIResponse<EmptyAPIResponse>;
    }
}
