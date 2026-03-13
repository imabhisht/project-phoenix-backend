import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtUser } from '../interfaces/jwt-user.interface';

/**
 * Guard to check if the authenticated user has the required role(s)
 * Must be used after JwtAuthGuard
 * 
 * Usage:
 * @Roles('admin', 'owner')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * async adminOnlyEndpoint() { ... }
 */
@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger = new Logger(RolesGuard.name);

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Get the required roles from the @Roles() decorator
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        // If no roles are specified, allow access
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        // Get the user from the request (set by JwtAuthGuard)
        const request = context.switchToHttp().getRequest();
        const user: JwtUser = request.user;

        if (!user) {
            this.logger.error('No user found in request. JwtAuthGuard must be used before RolesGuard');
            throw new ForbiddenException('Authentication required');
        }

        // Check if user's role matches any of the required roles
        const hasRole = requiredRoles.includes(user.role);

        if (!hasRole) {
            this.logger.warn(
                `User ${user.email} with role '${user.role}' attempted to access endpoint requiring roles: ${requiredRoles.join(', ')}`,
            );
            throw new ForbiddenException(
                `Access denied. Required roles: ${requiredRoles.join(', ')}`,
            );
        }

        this.logger.log(
            `User ${user.email} with role '${user.role}' authorized for endpoint`,
        );

        return true;
    }
}
