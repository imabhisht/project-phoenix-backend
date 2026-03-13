import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EntityTypes, EntityTypesData } from '../domain/entities/entityTypes.scheme';
import { EntityIdStrategyEnum } from '../domain/enums/entityIdStrategy.enum';

export class EntityTypesDataDTO {
    @ApiProperty({ enum: EntityIdStrategyEnum, default: EntityIdStrategyEnum.SOURCE_ID })
    @IsEnum(EntityIdStrategyEnum)
    @IsOptional()
    entity_id_strategy?: EntityIdStrategyEnum = EntityIdStrategyEnum.SOURCE_ID;

    @ApiProperty({ default: 1 })
    @IsNumber()
    @IsOptional()
    schema_version?: number = 1;
}

export class EntityTypeDTO {
    @ApiProperty()
    @IsOptional()
    id?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    collection_id?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    display_name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ type: () => EntityTypesDataDTO })
    @IsOptional()
    @Type(() => EntityTypesDataDTO)
    entity_data?: EntityTypesDataDTO;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    is_deleted?: boolean;

    @ApiProperty()
    @IsOptional()
    created_at?: Date;

    @ApiProperty()
    @IsOptional()
    updated_at?: Date;

    toSchema(collection_id: string): EntityTypes {
        const entityType = new EntityTypes();
        entityType.collection_id = collection_id;
        entityType.name = this.name;
        entityType.display_name = this.display_name;
        entityType.description = this.description || '';
        entityType.is_deleted = false;
        entityType.created_at = new Date();
        entityType.updated_at = new Date();

        const data = new EntityTypesData();
        data.entity_id_strategy = this.entity_data?.entity_id_strategy ?? EntityIdStrategyEnum.SOURCE_ID;
        data.schema_version = this.entity_data?.schema_version ?? 1;
        entityType.entity_data = data;

        return entityType;
    }

    static fromSchema(entityType: EntityTypes): EntityTypeDTO {
        const dto = new EntityTypeDTO();
        dto.id = entityType._id;
        dto.collection_id = entityType.collection_id;
        dto.name = entityType.name;
        dto.display_name = entityType.display_name;
        dto.description = entityType.description;
        dto.is_deleted = entityType.is_deleted;
        dto.created_at = entityType.created_at;
        dto.updated_at = entityType.updated_at;

        if (entityType.entity_data) {
            const dataDto = new EntityTypesDataDTO();
            dataDto.entity_id_strategy = entityType.entity_data.entity_id_strategy;
            dataDto.schema_version = entityType.entity_data.schema_version;
            dto.entity_data = dataDto;
        }

        return dto;
    }
}
