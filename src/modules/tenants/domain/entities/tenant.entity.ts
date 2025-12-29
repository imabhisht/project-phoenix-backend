export class Tenant {
    id: string;
    firebase_tenant_id: string;
    name: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;

    constructor(data: {
        id: string;
        firebase_tenant_id: string;
        name: string;
        description: string | null;
        created_at: Date;
        updated_at: Date;
    }) {
        this.id = data.id;
        this.firebase_tenant_id = data.firebase_tenant_id;
        this.name = data.name;
        this.description = data.description;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static fromDatabase(dbData?: {
        id: string;
        firebase_tenant_id: string;
        name: string;
        description: string | null;
        created_at: Date;
        updated_at: Date;
    }): Tenant {
        return new Tenant(dbData ?? undefined);
    }

    toObject(): {
        id: string;
        firebase_tenant_id: string;
        name: string;
        description: string | null;
        created_at: Date;
        updated_at: Date;
    } {
        return {
            id: this.id,
            firebase_tenant_id: this.firebase_tenant_id,
            name: this.name,
            description: this.description,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }
}
