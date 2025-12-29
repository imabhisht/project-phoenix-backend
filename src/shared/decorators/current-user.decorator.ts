import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FirebaseUser } from '../interfaces/firebase-user.interface';

/**
 * Parameter decorator to extract the authenticated Firebase user from the request
 * 
 * Usage:
 * @UseGuards(FirebaseAuthGuard)
 * async getProfile(@CurrentUser() user: FirebaseUser) {
 *   return { name: user.name, email: user.email };
 * }
 * 
 * @returns The authenticated FirebaseUser object attached by FirebaseAuthGuard
 */
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): FirebaseUser => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
