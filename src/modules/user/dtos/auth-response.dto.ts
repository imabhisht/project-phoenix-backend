import { User } from '../domain/entities/user.entity';

export class AuthResponseDto {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        organization_id: string;
        role: string;
    };

    constructor(token: string, user: User) {
        this.token = token;
        this.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            organization_id: user.organization_id,
            role: user.role,
        };
    }
}
