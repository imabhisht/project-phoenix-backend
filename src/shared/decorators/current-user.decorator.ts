import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from '../interfaces/jwt-user.interface';

/**
 * Parameter decorator to extract the authenticated JWT user from the request
 * 
 * Usage:
 * @UseGuards(JwtAuthGuard)
 * async getProfile(@CurrentUser() user: JwtUser) {
 *   return { name: user.name, email: user.email };
 * }
 * 
 * @returns The authenticated JwtUser object attached by JwtAuthGuard
 */
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): JwtUser => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
