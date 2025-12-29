import { users } from '@modules/prisma/generated';

export class User {
    id: string;
    name: string;
    organization_id: string;
    email: string;
    username: string;
    created_at: Date;
    updated_at: Date;
    role: string;

    constructor(data: {
        id: string;
        name: string;
        organization_id: string;
        email: string;
        username: string;
        created_at: Date;
        updated_at: Date;
        role: string;
    }) {
        this.id = data.id;
        this.name = data.name;
        this.organization_id = data.organization_id;
        this.email = data.email;
        this.username = data.username;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.role = data.role;
    }

    static fromDatabase(dbData?: {
        id: string;
        name: string;
        organization_id: string;
        email: string;
        username: string;
        created_at: Date;
        updated_at: Date;
        role: string;
    }): User | undefined {
        if (!dbData) {
            return undefined;
        }
        return new User(dbData);
    }

    toObject(): users {
        return {
            id: this.id,
            name: this.name,
            organization_id: this.organization_id,
            email: this.email,
            username: this.username,
            created_at: this.created_at,
            updated_at: this.updated_at,
            role: this.role
        };
    }
}
