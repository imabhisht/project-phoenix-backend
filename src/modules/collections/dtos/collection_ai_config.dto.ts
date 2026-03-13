import { IsString, IsNotEmpty, IsOptional, IsDate, IsNumber } from 'class-validator';
import { CollectionAIConfig } from '../domain/entities/colletion_ai_config';
import { ApiProperty } from '@nestjs/swagger';

export class CollectionAIConfigDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    embedding_model: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    embedding_dimensions?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    rerank_model?: string;

    toSchema(): CollectionAIConfig {
        const schema = new CollectionAIConfig();
        schema.embedding_model = this.embedding_model || null;
        schema.embedding_dimensions = this.embedding_dimensions || null;
        schema.rerank_model = this.rerank_model || null;
        return schema;
    }

    static fromSchema(collectionAIConfig: CollectionAIConfig): CollectionAIConfigDTO {
        const dto = new CollectionAIConfigDTO();
        dto.embedding_model = collectionAIConfig.embedding_model || null;
        dto.embedding_dimensions = collectionAIConfig.embedding_dimensions || null;
        dto.rerank_model = collectionAIConfig.rerank_model || null;
        return dto;
    }
}