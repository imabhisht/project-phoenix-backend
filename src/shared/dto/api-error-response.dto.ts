/**
 * API Error Response DTO
 * Standardized error response structure for all API endpoints
 */
export class APIErrorResponse {
    errorCode: number;
    userErrorText: string;
    developerErrorText: string;

    constructor(
        errorCode: number,
        userErrorText: string,
        developerErrorText: string,
    ) {
        this.errorCode = errorCode;
        this.userErrorText = userErrorText;
        this.developerErrorText = developerErrorText;
    }
}
