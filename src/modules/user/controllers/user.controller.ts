import {
    Controller,
    Post,
    Get,
    Body,
    HttpCode,
    HttpStatus,
    Logger,
    UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RequestOtpDto } from '../dtos/request-otp.dto';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { CreateOwnerDto } from '../dtos/create-owner.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { APIResponse, EmptyAPIResponse } from '../../../shared/dto';
import { FirebaseAuthGuard, RolesGuard } from '@shared/guards';
import { CurrentUser, Roles } from '@shared/decorators';
import { FirebaseUser } from '@shared/interfaces';
import { UserRoles } from '../domain/enums/userRoles.enum';
import { UserDTO } from '../dtos/user.dto';

@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) { }

    @Get("info")
    @UseGuards(FirebaseAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getUserInfo(
        @CurrentUser() user: FirebaseUser,
    ): Promise<APIResponse<UserDTO> | APIResponse<EmptyAPIResponse>> {
        try {
            const userInfo = await this.userService.userInfo(user);

            return new APIResponse<UserDTO>().SuccessResult(userInfo);
        } catch (error: any) {
            this.logger.error('Failed to get profile', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                error.message || 'Failed to get profile',
                `Error getting profile: ${error.message || 'Unknown error'}`,
            );
        }
    }

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
    ): Promise<APIResponse<EmptyAPIResponse>> {
        try {
            await this.userService.createOwner(
                createOwnerDto.org_id,
                createOwnerDto.email,
                createOwnerDto.name,
            );

            return new APIResponse<EmptyAPIResponse>().SuccessResult({});
        } catch (error: any) {
            this.logger.error('Failed to create owner', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                error.message || 'Failed to create owner user',
                `Error creating owner: ${error.message || 'Unknown error'}`,
            );
        }
    }

    /**
     * Get current user profile (Protected endpoint example)
     * GET /user/profile
     * Requires valid Firebase authentication token
     */
    @Get('profile')
    @UseGuards(FirebaseAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getProfile(
        @CurrentUser() user: FirebaseUser,
    ): Promise<APIResponse<FirebaseUser> | APIResponse<EmptyAPIResponse>> {
        try {
            this.logger.log(`Profile request from user: ${user.email}`);

            return new APIResponse<FirebaseUser>().SuccessResult(user);
        } catch (error: any) {
            this.logger.error('Failed to get profile', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                error.message || 'Failed to get profile',
                `Error getting profile: ${error.message || 'Unknown error'}`,
            );
        }
    }

    /**
     * Admin/Owner only endpoint example
     * GET /user/admin-dashboard
     * Requires valid Firebase token AND user must have 'admin' or 'owner' role
     */
    @Get('admin-dashboard')
    @UseGuards(FirebaseAuthGuard, RolesGuard)
    @Roles(UserRoles.ADMIN, UserRoles.OWNER)
    @HttpCode(HttpStatus.OK)
    async getAdminDashboard(
        @CurrentUser() user: FirebaseUser,
    ): Promise<APIResponse<{ message: string; user: FirebaseUser }> | APIResponse<EmptyAPIResponse>> {
        try {
            this.logger.log(`Admin dashboard access by: ${user.email} (${user.role})`);

            return new APIResponse<{ message: string; user: FirebaseUser }>().SuccessResult({
                message: 'Welcome to the admin dashboard!',
                user,
            });
        } catch (error: any) {
            this.logger.error('Failed to access admin dashboard', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                error.message || 'Failed to access admin dashboard',
                `Error accessing admin dashboard: ${error.message || 'Unknown error'}`,
            );
        }
    }
}
