import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtUser } from '@shared/interfaces/jwt-user.interface';
import { JwtOptions, EnvObjects } from '@core/config/configuration';

export interface RefreshTokenPayload {
    sub: string;
    jti: string;
}

/**
 * TokenService is the single source of truth for signing and verifying JWT tokens.
 * - Access tokens: short-lived (1h), contain full user claims.
 * - Refresh tokens: long-lived (30d), contain only user id and a unique jti.
 */
@Injectable()
export class TokenService {
    private readonly logger = new Logger(TokenService.name);
    private readonly jwtOptions: JwtOptions;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.jwtOptions = this.configService.get<JwtOptions>(EnvObjects.JWT_OPTIONS)!;
    }

    /**
     * Signs a new access token containing full user claims.
     */
    signAccessToken(payload: Omit<JwtUser, 'iat' | 'exp'>): string {
        return this.jwtService.sign(payload as any, {
            secret: this.jwtOptions.accessSecret,
            expiresIn: this.jwtOptions.accessExpiresIn as any,
        });
    }

    /**
     * Signs a new refresh token.
     * Only embeds sub (user id) + jti so the payload is minimal.
     */
    signRefreshToken(sub: string, jti: string): string {
        return this.jwtService.sign(
            { sub, jti } as any,
            {
                secret: this.jwtOptions.refreshSecret,
                expiresIn: this.jwtOptions.refreshExpiresIn as any,
            },
        );
    }

    /**
     * Verifies and returns the decoded access token payload.
     * Throws UnauthorizedException if invalid / expired.
     */
    verifyAccessToken(token: string): JwtUser {
        try {
            return this.jwtService.verify<JwtUser>(token, {
                secret: this.jwtOptions.accessSecret,
            });
        } catch (err: any) {
            this.logger.warn(`Access token verification failed: ${err.message}`);
            throw new UnauthorizedException('Invalid or expired access token');
        }
    }

    /**
     * Verifies and returns the decoded refresh token payload.
     * Throws UnauthorizedException if invalid / expired.
     */
    verifyRefreshToken(token: string): RefreshTokenPayload {
        try {
            return this.jwtService.verify<RefreshTokenPayload>(token, {
                secret: this.jwtOptions.refreshSecret,
            });
        } catch (err: any) {
            this.logger.warn(`Refresh token verification failed: ${err.message}`);
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}
