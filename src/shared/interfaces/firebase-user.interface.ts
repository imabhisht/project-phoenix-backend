/**
 * Interface representing a Firebase authenticated user
 * Based on the decoded Firebase JWT token structure
 */
export interface FirebaseUser {
    /** User's full name */
    name: string;

    /** User's email address */
    email: string;

    /** Organization ID the user belongs to */
    organization_id: string;

    /** User's role (e.g., 'owner', 'admin', 'user') */
    role: string;

    /** Firebase user ID */
    user_id: string;

    /** Subject - same as user_id */
    sub: string;

    /** Whether the email has been verified */
    email_verified: boolean;

    /** Issuer - Firebase project URL */
    iss: string;

    /** Audience - Firebase project ID */
    aud: string;

    /** Authentication time (Unix timestamp) */
    auth_time: number;

    /** Issued at time (Unix timestamp) */
    iat: number;

    /** Expiration time (Unix timestamp) */
    exp: number;

    /** Firebase-specific metadata */
    firebase: {
        /** User identities */
        identities: {
            email: string[];
        };
        /** Sign-in provider (e.g., 'custom', 'google.com') */
        sign_in_provider: string;
        /** Firebase tenant ID */
        tenant: string;
    };
}
