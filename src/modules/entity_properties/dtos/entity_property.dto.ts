import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EntityProperties, EntityPropertiesData } from '../domain/entities/entityProperties.scheme';
import { EntityPropertiesDataTypeEnum } from '../domain/enums/entityPropertiesDataTypes.enum';

export class EntityPropertiesDataDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: false, nullable: true })
    @IsString()
    @IsOptional()
    description?: string | null;

    @ApiProperty({ enum: EntityPropertiesDataTypeEnum })
    @IsEnum(EntityPropertiesDataTypeEnum)
    data_type: EntityPropertiesDataTypeEnum;

    @ApiProperty({ default: false })
    @IsBoolean()
    @IsOptional()
    is_required?: boolean = false;

    @ApiProperty({ default: false })
    @IsBoolean()
    @IsOptional()
    is_array?: boolean = false;

    @ApiProperty({ default: false })
    @IsBoolean()
    @IsOptional()
    is_nullable?: boolean = false;

    @ApiProperty({ required: false, nullable: true })
    @IsString()
    @IsOptional()
    default_value?: string | null;

    @ApiProperty({ default: false })
    @IsBoolean()
    @IsOptional()
    is_searchable?: boolean = false;

    @ApiProperty({ default: false })
    @IsBoolean()
    @IsOptional()
    is_filterable?: boolean = false;

    @ApiProperty({ default: false })
    @IsBoolean()
    @IsOptional()
    is_sortable?: boolean = false;

    @ApiProperty({ default: false })
    @IsBoolean()
    @IsOptional()
    is_facetable?: boolean = false;

    @ApiProperty({ default: false })
    @IsBoolean()
    @IsOptional()
    is_vectorizable?: boolean = false;
}

export class EntityPropertyDTO {
    @ApiProperty()
    @IsOptional()
    id?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    collection_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    entity_type_id: string;

    @ApiProperty({ type: () => EntityPropertiesDataDTO })
    @IsNotEmpty()
    @Type(() => EntityPropertiesDataDTO)
    property_data: EntityPropertiesDataDTO;

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

    toSchema(collection_id: string, entity_type_id: string): EntityProperties {
        const entityProperty = new EntityProperties();
        entityProperty.collection_id = collection_id;
        entityProperty.entity_type_id = entity_type_id;
        entityProperty.is_deleted = false;
        entityProperty.created_at = new Date();
        entityProperty.updated_at = new Date();

        const data = new EntityPropertiesData();
        data.name = this.property_data.name;
        data.description = this.property_data.description ?? null;
        data.data_type = this.property_data.data_type;
        data.is_required = this.property_data.is_required ?? false;
        data.is_array = this.property_data.is_array ?? false;
        data.is_nullable = this.property_data.is_nullable ?? false;
        data.default_value = this.property_data.default_value ?? null;
        data.is_searchable = this.property_data.is_searchable ?? false;
        data.is_filterable = this.property_data.is_filterable ?? false;
        data.is_sortable = this.property_data.is_sortable ?? false;
        data.is_facetable = this.property_data.is_facetable ?? false;
        data.is_vectorizable = this.property_data.is_vectorizable ?? false;
        entityProperty.property_data = data;

        return entityProperty;
    }

    static fromSchema(entityProperty: EntityProperties): EntityPropertyDTO {
        const dto = new EntityPropertyDTO();
        dto.id = entityProperty._id;
        dto.collection_id = entityProperty.collection_id;
        dto.entity_type_id = entityProperty.entity_type_id;
        dto.is_deleted = entityProperty.is_deleted;
        dto.created_at = entityProperty.created_at;
        dto.updated_at = entityProperty.updated_at;

        if (entityProperty.property_data) {
            const dataDto = new EntityPropertiesDataDTO();
            dataDto.name = entityProperty.property_data.name;
            dataDto.description = entityProperty.property_data.description;
            dataDto.data_type = entityProperty.property_data.data_type;
            dataDto.is_required = entityProperty.property_data.is_required;
            dataDto.is_array = entityProperty.property_data.is_array;
            dataDto.is_nullable = entityProperty.property_data.is_nullable;
            dataDto.default_value = entityProperty.property_data.default_value;
            dataDto.is_searchable = entityProperty.property_data.is_searchable;
            dataDto.is_filterable = entityProperty.property_data.is_filterable;
            dataDto.is_sortable = entityProperty.property_data.is_sortable;
            dataDto.is_facetable = entityProperty.property_data.is_facetable;
            dataDto.is_vectorizable = entityProperty.property_data.is_vectorizable;
            dto.property_data = dataDto;
        }

        return dto;
    }
}
