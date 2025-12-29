import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RequestOtpDto } from '../dtos/request-otp.dto';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { CreateOwnerDto } from '../dtos/create-owner.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { APIResponse, EmptyAPIResponse } from '../../../shared/dto';

@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) { }

    /**
     * Request OTP endpoint
     * POST /user/request-otp
     */
    @Post('request-otp')
    @HttpCode(HttpStatus.OK)
    async requestOtp(
        @Body() requestOtpDto: RequestOtpDto,
    ): Promise<APIResponse<{ message: string }> | APIResponse<EmptyAPIResponse>> {
        try {
            this.logger.log(
                `OTP request received for email: ${requestOtpDto.email}, org: ${requestOtpDto.org_id}`,
            );

            const result = await this.userService.requestOtp(
                requestOtpDto.email,
                requestOtpDto.org_id,
            );

            return new APIResponse<{ message: string }>().SuccessResult(result);
        } catch (error: any) {
            this.logger.error('Failed to request OTP', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                error.message || 'Failed to request OTP',
                `Error requesting OTP: ${error.message || 'Unknown error'}`,
            );
        }
    }

    /**
     * Verify OTP and get Firebase token endpoint
     * POST /user/verify-otp
     */
    @Post('verify-otp')
    @HttpCode(HttpStatus.OK)
    async verifyOtp(
        @Body() verifyOtpDto: VerifyOtpDto,
    ): Promise<APIResponse<AuthResponseDto> | APIResponse<EmptyAPIResponse>> {
        try {
            this.logger.log(
                `OTP verification request for email: ${verifyOtpDto.email}, org: ${verifyOtpDto.org_id}`,
            );

            const result = await this.userService.verifyOtpAndGenerateToken(
                verifyOtpDto.email,
                verifyOtpDto.org_id,
                verifyOtpDto.otp,
            );

            return new APIResponse<AuthResponseDto>().SuccessResult(result);
        } catch (error: any) {
            this.logger.error('Failed to verify OTP', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                error.message || 'Failed to verify OTP',
                `Error verifying OTP: ${error.message || 'Unknown error'}`,
            );
        }
    }

    /**
     * Create owner user endpoint
     * POST /user/create-owner
     * This endpoint is intended to be called by admins only
     */
    @Post('create-owner')
    @HttpCode(HttpStatus.CREATED)
    async createOwner(
        @Body() createOwnerDto: CreateOwnerDto,
    ): Promise<APIResponse<AuthResponseDto> | APIResponse<EmptyAPIResponse>> {
        try {
            this.logger.log(
                `Owner creation request received for email: ${createOwnerDto.email}, org: ${createOwnerDto.org_id}`,
            );

            const result = await this.userService.createOwner(
                createOwnerDto.org_id,
                createOwnerDto.email,
                createOwnerDto.name,
            );

            return new APIResponse<AuthResponseDto>().SuccessResult(result);
        } catch (error: any) {
            this.logger.error('Failed to create owner', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                error.message || 'Failed to create owner user',
                `Error creating owner: ${error.message || 'Unknown error'}`,
            );
        }
    }
}
