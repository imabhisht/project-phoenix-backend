import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Logger,
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { APIResponse, EmptyAPIResponse } from '@shared/dto';
import { JwtAuthGuard, RolesGuard } from '@shared/guards';
import { Roles } from '@shared/decorators';
import { UserRoles } from '@modules/user/domain/enums/userRoles.enum';
import { UserDTO } from '@modules/user/dtos/user.dto';

@Controller('admin')
@Roles(UserRoles.OWNER)
export class AdminController {
    private readonly logger = new Logger(AdminController.name);

    constructor(private readonly adminService: AdminService) { }

    @Post('users')
    @HttpCode(HttpStatus.CREATED)
    async createUser(
        @Body() dto: CreateUserDto,
    ): Promise<APIResponse<UserDTO> | APIResponse<EmptyAPIResponse>> {
        try {
            const user = await this.adminService.createUser(dto);
            const userDto = UserDTO.fromSchema(user);
            return new APIResponse<UserDTO>().SuccessResult(userDto);
        } catch (error: any) {
            this.logger.error('Failed to create user', error);
            return new APIResponse<EmptyAPIResponse>().ErrorResult(
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                error.message || 'Failed to create user',
                error.message,
            );
        }
    }
}
