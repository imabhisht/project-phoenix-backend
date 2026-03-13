import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '@modules/token/services/token.service';

/**
 * Guard that validates the JWT refresh token from the `refresh_token` HttpOnly cookie.
 * Used exclusively on POST /auth/refresh to issue a new token pair.
 * Attaches the minimal refresh payload to request.user.
 */
@Injectable()
export class JwtRefreshGuard implements CanActivate {
    private readonly logger = new Logger(JwtRefreshGuard.name);

    constructor(private readonly tokenService: TokenService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies?.['refresh_token'];

        if (!token) {
            this.logger.warn('No refresh_token cookie found');
            throw new UnauthorizedException('No refresh token provided');
        }

        const payload = this.tokenService.verifyRefreshToken(token);
        request['user'] = payload; // { sub, jti }

        this.logger.log(`Refresh guard passed for user=${payload.sub}`);
        return true;
    }
}
