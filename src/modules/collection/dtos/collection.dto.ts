import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Collection } from '../domain/entities/collection.schema';

export class CollectionDTO {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    org_id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    user_id: string;

    toSchema(): Collection {
        return {
            _id: this.id,
            org_id: this.org_id,
            name: this.name,
            description: this.description || null,
            user_id: this.user_id,
            is_deleted: false,
            created_at: new Date(),
            updated_at: new Date(),
        };
    }

    static fromSchema(collection: Collection): CollectionDTO {
        const dto = new CollectionDTO();
        dto.id = collection._id;
        dto.org_id = collection.org_id;
        dto.name = collection.name;
        dto.description = collection.description || undefined;
        dto.user_id = collection.user_id;
        return dto;
    }
}