import { User } from '../domain/entities/user.entity';

export class AuthResponseDto {
    token: string;
    firebase_tenant_id: string;
    user: {
        id: string;
        name: string;
        email: string;
        organization_id: string;
        role: string;
    };

    constructor(token: string, firebase_tenant_id: string, user: User) {
        this.token = token;
        this.firebase_tenant_id = firebase_tenant_id;
        this.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            organization_id: user.organization_id,
            role: user.role,
        };
    }
}
