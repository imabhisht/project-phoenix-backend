import { UserRoles } from '@modules/user/domain/enums/userRoles.enum';
import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for roles
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator to specify which roles are allowed to access an endpoint
 * 
 * Usage:
 * @Roles('admin', 'owner')
 * @UseGuards(FirebaseAuthGuard, RolesGuard)
 * async adminOnlyEndpoint() { ... }
 * 
 * @param roles - Variable number of role strings that are allowed
 */
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
