import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { APIResponse, EmptyAPIResponse } from '@shared/dto';
import { JwtAuthGuard, RolesGuard } from '@shared/guards';
import { CurrentUser, Roles } from '@shared/decorators';
import { JwtUser } from '@shared/interfaces/jwt-user.interface';
import { UserRoles } from '../domain/enums/userRoles.enum';
import { UserDTO } from '../dtos/user.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) { }

    @Get("info")
    @HttpCode(HttpStatus.OK)
    async getUserInfo(
        @CurrentUser() user: JwtUser,
    ): Promise<APIResponse<UserDTO> | APIResponse<EmptyAPIResponse>> {
        try {
            const userInfo = await this.userService.userInfo(user);
            return new APIResponse<UserDTO>().SuccessResult(userInfo);
        } catch (error: any) {
            this.logger.error('Failed to get user info', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                error.message || 'Failed to get user info',
                error.message,
            );
        }
    }

    @Get('profile')
    @HttpCode(HttpStatus.OK)
    async getProfile(
        @CurrentUser() user: JwtUser,
    ): Promise<APIResponse<JwtUser> | APIResponse<EmptyAPIResponse>> {
        try {
            return new APIResponse<JwtUser>().SuccessResult(user);
        } catch (error: any) {
            this.logger.error('Failed to get profile', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                error.message || 'Failed to get profile',
                error.message,
            );
        }
    }

    @Get('admin-dashboard')
    @UseGuards(RolesGuard)
    @Roles(UserRoles.ADMIN, UserRoles.OWNER)
    @HttpCode(HttpStatus.OK)
    async getAdminDashboard(
        @CurrentUser() user: JwtUser,
    ): Promise<APIResponse<{ message: string; user: JwtUser }> | APIResponse<EmptyAPIResponse>> {
        try {
            return new APIResponse<{ message: string; user: JwtUser }>().SuccessResult({
                message: 'Welcome to the admin dashboard!',
                user,
            });
        } catch (error: any) {
            this.logger.error('Failed to access admin dashboard', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                error.message || 'Failed to access admin dashboard',
                error.message,
            );
        }
    }
}
