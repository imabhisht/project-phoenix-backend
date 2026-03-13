import {
    Controller,
    Post,
    Body,
    Res,
    HttpCode,
    HttpStatus,
    UseGuards,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RequestOtpDto } from '../dtos/request-otp.dto';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { APIResponse, EmptyAPIResponse } from '@shared/dto';
import { JwtAuthGuard, JwtRefreshGuard } from '@shared/guards';
import { CurrentUser } from '@shared/decorators';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) { }

    @Post('request-otp')
    @HttpCode(HttpStatus.OK)
    async requestOtp(
        @Body() dto: RequestOtpDto,
    ): Promise<APIResponse<{ message: string }> | APIResponse<EmptyAPIResponse>> {
        try {
            const result = await this.authService.requestOtp(dto.email, dto.org_id);
            return new APIResponse<{ message: string }>().SuccessResult(result);
        } catch (error: any) {
            this.logger.error('Failed to request OTP', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                error.message || 'Failed to request OTP',
                error.message,
            );
        }
    }

    @Post('verify-otp')
    @HttpCode(HttpStatus.OK)
    async verifyOtp(
        @Body() dto: VerifyOtpDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<APIResponse<{ message: string }> | APIResponse<EmptyAPIResponse>> {
        try {
            await this.authService.verifyOtp(dto.email, dto.org_id, dto.otp, res);
            return new APIResponse<{ message: string }>().SuccessResult({ message: 'Login successful' });
        } catch (error: any) {
            this.logger.error('Failed to verify OTP', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                error.status || HttpStatus.UNAUTHORIZED,
                error.message || 'Verification failed',
                error.message,
            );
        }
    }

    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    @HttpCode(HttpStatus.OK)
    async refresh(
        @CurrentUser() user: { sub: string; jti: string },
        @Res({ passthrough: true }) res: Response,
    ): Promise<APIResponse<{ message: string }> | APIResponse<EmptyAPIResponse>> {
        try {
            await this.authService.refresh(user.sub, user.jti, res);
            return new APIResponse<{ message: string }>().SuccessResult({ message: 'Tokens refreshed' });
        } catch (error: any) {
            this.logger.error('Failed to refresh tokens', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                error.status || HttpStatus.UNAUTHORIZED,
                error.message || 'Refresh failed',
                error.message,
            );
        }
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(
        @CurrentUser() user: { sub: string; jti: string },
        @Res({ passthrough: true }) res: Response,
    ): Promise<APIResponse<{ message: string }> | APIResponse<EmptyAPIResponse>> {
        try {
            await this.authService.logout(user.sub, user.jti, res);
            return new APIResponse<{ message: string }>().SuccessResult({ message: 'Logged out successfully' });
        } catch (error: any) {
            this.logger.error('Logout error', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Logout failed',
                error.message,
            );
        }
    }
}
