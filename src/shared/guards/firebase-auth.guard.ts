import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { FirebaseService } from '@modules/firebase/firebase.service';
import { FirebaseUser } from '../interfaces/firebase-user.interface';

/**
 * Guard to verify Firebase JWT tokens and attach user data to request
 * 
 * Usage:
 * @UseGuards(FirebaseAuthGuard)
 * async protectedEndpoint(@CurrentUser() user: FirebaseUser) { ... }
 */
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    private readonly logger = new Logger(FirebaseAuthGuard.name);

    constructor(private readonly firebaseService: FirebaseService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            this.logger.warn('No authorization header provided');
            throw new UnauthorizedException('No authorization token provided');
        }

        // Extract token from "Bearer <token>" format
        const token = this.extractTokenFromHeader(authHeader);
        if (!token) {
            this.logger.warn('Invalid authorization header format');
            throw new UnauthorizedException('Invalid authorization header format');
        }

        try {
            // Verify the Firebase token
            const decodedToken = await this.firebaseService
                .getAuth()
                .verifyIdToken(token);

            // Attach the decoded user to the request object
            // Cast through unknown since DecodedIdToken includes custom claims
            request.user = decodedToken as unknown as FirebaseUser;

            this.logger.log(
                `User authenticated: ${decodedToken.email} (${decodedToken.user_id})`,
            );

            return true;
        } catch (error: any) {
            this.logger.error('Token verification failed', error.message);

            // Provide specific error messages based on Firebase error codes
            if (error.code === 'auth/id-token-expired') {
                throw new UnauthorizedException('Token has expired');
            } else if (error.code === 'auth/id-token-revoked') {
                throw new UnauthorizedException('Token has been revoked');
            } else if (error.code === 'auth/argument-error') {
                throw new UnauthorizedException('Invalid token format');
            }

            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    /**
     * Extract token from Authorization header
     * Expected format: "Bearer <token>"
     */
    private extractTokenFromHeader(authHeader: string): string | null {
        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null;
        }

        return parts[1];
    }
}
