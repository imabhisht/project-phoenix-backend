import {
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
    InternalServerErrorException,
    OnModuleInit,
} from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '@modules/user/repository/user.repository';
import { TokenService } from '@modules/token/services/token.service';
import { MongodbService } from '@infrastructure/database/mongodb';
import { Collection } from 'mongodb';

interface RefreshTokenDoc {
    user_id: string;
    jti: string;
    created_at: Date;
}

@Injectable()
export class AuthService implements OnModuleInit {
    private readonly logger = new Logger(AuthService.name);
    private refreshTokenCollection: Collection<RefreshTokenDoc>;
    private readonly REFRESH_TOKEN_COLLECTION = 'user_refresh_tokens';

    constructor(
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
        private readonly mongodbService: MongodbService,
    ) { }

    async onModuleInit() {
        this.refreshTokenCollection = this.mongodbService
            .getDb()
            .collection<RefreshTokenDoc>(this.REFRESH_TOKEN_COLLECTION);

        // Setup TTL for refresh tokens (30 days)
        await this.refreshTokenCollection.createIndex(
            { created_at: 1 },
            { expireAfterSeconds: 30 * 24 * 60 * 60 },
        ).catch(err => this.logger.error('Failed to create TTL index for refresh tokens', err));
    }

    async requestOtp(email: string, org_id: string): Promise<{ message: string }> {
        const user = await this.userRepository.findByOrganizationAndEmail(org_id, email);
        if (!user) {
            throw new NotFoundException('User not found in this organization');
        }

        const otp = process.env.NODE_ENV === 'development' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();

        await this.userRepository.createOtp(email, org_id, otp);

        this.logger.log(`[AUTH] OTP for ${email} (org: ${org_id}): ${otp}`);

        return { message: 'OTP sent successfully (check console)' };
    }

    async verifyOtp(email: string, org_id: string, otp: string, res: Response): Promise<void> {
        const storedOtp = await this.userRepository.findOtp(email, org_id);
        if (!storedOtp || storedOtp.otp !== otp) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        const user = await this.userRepository.findByOrganizationAndEmail(org_id, email);
        if (!user) {
            throw new NotFoundException('User no longer exists');
        }

        await this.userRepository.deleteOtp(email, org_id);

        const jti = uuidv4();
        await this.issueTokens(user, jti, res);
    }

    async refresh(userId: string, jti: string, res: Response): Promise<void> {
        // Verify jti exists in DB (not revoked)
        const tokenDoc = await this.refreshTokenCollection.findOne({ user_id: userId, jti });
        if (!tokenDoc) {
            throw new UnauthorizedException('Refresh token is invalid or has been revoked');
        }

        // Revoke old token
        await this.refreshTokenCollection.deleteOne({ _id: tokenDoc._id });

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User no longer exists');
        }

        const newJti = uuidv4();
        await this.issueTokens(user, newJti, res);
    }

    async logout(userId: string, jti: string, res: Response): Promise<void> {
        await this.refreshTokenCollection.deleteOne({ user_id: userId, jti });
        this.clearCookies(res);
    }

    private async issueTokens(user: any, jti: string, res: Response): Promise<void> {
        const accessToken = this.tokenService.signAccessToken({
            sub: user._id,
            email: user.email,
            name: user.name,
            org_id: user.org_id,
            role: user.role,
            jti,
        });

        const refreshToken = this.tokenService.signRefreshToken(user._id, jti);

        // Store refresh token in DB
        await this.refreshTokenCollection.insertOne({
            user_id: user._id,
            jti,
            created_at: new Date(),
        });

        this.setCookies(res, accessToken, refreshToken);
    }

    private setCookies(res: Response, access: string, refresh: string) {
        const isProd = process.env.NODE_ENV === 'production';

        res.cookie('access_token', access, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.cookie('refresh_token', refresh, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
    }

    private clearCookies(res: Response) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
    }
}
