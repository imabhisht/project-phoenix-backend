import { UserRoles } from '@modules/user/domain/enums/userRoles.enum';

/**
 * Represents the decoded payload stored inside a JWT access token.
 * This is what gets attached to `request.user` after JwtAuthGuard validates the token.
 */
export interface JwtUser {
    /** MongoDB user _id */
    sub: string;

    /** User's email address */
    email: string;

    /** User's display name */
    name: string;

    /** Organization (tenant) ID */
    org_id: string;

    /** User role for RBAC */
    role: UserRoles;

    /** Unique token ID — used for revocation and refresh token pairing */
    jti: string;

    /** Issued at (Unix timestamp) */
    iat: number;

    /** Expiration (Unix timestamp) */
    exp: number;
}
