import { IsString, IsNotEmpty, IsOptional, IsDate, ValidateNested } from 'class-validator';
import { Collection } from '../domain/entities/collection.schema';
import { ApiProperty } from '@nestjs/swagger';
import { CollectionSourceOverviewDTO } from '@modules/collection_source/dtos/collectionSourceOverview.dto';
import { CollectionSource } from '@modules/collection_source/domain/entities/collection_source.scheme';

export class CollectionOverviewDTO {
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
    collection_sources?: CollectionSourceOverviewDTO[];

    @ApiProperty()
    @IsString()
    @IsOptional()
    created_at?: Date;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    updated_at?: Date;

    static fromSchema(collection: Collection, collectionSources: CollectionSource[]): CollectionOverviewDTO {
        const dto = new CollectionOverviewDTO();
        dto.id = collection._id;
        dto.name = collection.name;
        dto.description = collection.description || null;
        dto.created_at = collection.created_at;
        dto.updated_at = collection.updated_at;
        dto.collection_sources = collectionSources.map(collectionSource => CollectionSourceOverviewDTO.fromSchema(collectionSource));
        return dto;
    }
}