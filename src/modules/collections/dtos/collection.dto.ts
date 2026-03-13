import { IsString, IsNotEmpty, IsOptional, IsDate, ValidateNested } from 'class-validator';
import { Collection } from '../domain/entities/collection.schema';
import { ApiProperty } from '@nestjs/swagger';
import { CollectionAIConfigDTO } from './collection_ai_config.dto';

export class CollectionDTO {
    @ApiProperty()
    @IsOptional()
    id?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @ValidateNested({ each: true })
    @IsOptional()
    ai_config?: CollectionAIConfigDTO;

    @ApiProperty()
    @IsString()
    @IsOptional()
    created_at?: Date;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    updated_at?: Date;

    toSchema(org_id: string, user_id: string): Collection {
        const collection = new Collection({});
        collection.name = this.name;
        collection.org_id = org_id;
        collection.user_id = user_id;
        collection.description = this.description || null;
        collection.ai_config = this.ai_config ? this.ai_config.toSchema() : null;
        collection.is_deleted = false;
        collection.created_at = new Date();
        collection.updated_at = new Date();
        return collection;
    }

    static fromSchema(collection: Collection): CollectionDTO {
        const dto = new CollectionDTO();
        dto.id = collection._id;
        dto.name = collection.name;
        dto.description = collection.description || null;
        dto.ai_config = collection.ai_config ? CollectionAIConfigDTO.fromSchema(collection.ai_config) : null;
        dto.created_at = collection.created_at;
        dto.updated_at = collection.updated_at;
        return dto;
    }
}