import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '@modules/token/services/token.service';
import { JwtUser } from '../interfaces/jwt-user.interface';

/**
 * Guard that validates the JWT access token from the `access_token` HttpOnly cookie.
 *
 * Usage:
 * @UseGuards(JwtAuthGuard)
 * async protectedRoute(@CurrentUser() user: JwtUser) { ... }
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name);

    constructor(private readonly tokenService: TokenService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies?.['access_token'];

        if (!token) {
            this.logger.warn('No access_token cookie found');
            throw new UnauthorizedException('No access token provided');
        }

        const user: JwtUser = this.tokenService.verifyAccessToken(token);
        request['user'] = user;

        this.logger.log(`Authenticated: ${user.email} [${user.role}] org=${user.org_id}`);
        return true;
    }
}
