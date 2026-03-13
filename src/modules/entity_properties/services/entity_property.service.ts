import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EntityPropertyRepository } from '../repository/entity_property.repository';
import { EntityPropertyDTO } from '../dtos/entity_property.dto';
import { EntityProperties } from '../domain/entities/entityProperties.scheme';
import { CollectionRepository } from '@modules/collections/repository/collection.repository';
import { EntityTypeRepository } from '@modules/entity_types/repository/entity_type.repository';

@Injectable()
export class EntityPropertyService {
    private readonly logger = new Logger(EntityPropertyService.name);

    constructor(
        private readonly entityPropertyRepository: EntityPropertyRepository,
        private readonly collectionRepository: CollectionRepository,
        private readonly entityTypeRepository: EntityTypeRepository,
    ) { }

    private async validateCollectionOwnership(collection_id: string, org_id: string): Promise<void> {
        const collection = await this.collectionRepository.findById(collection_id);
        if (!collection || collection.is_deleted) {
            throw new NotFoundException('Collection not found');
        }
        if (collection.org_id !== org_id) {
            throw new NotFoundException('Collection not found');
        }
    }

    private async validateEntityType(entity_type_id: string, collection_id: string): Promise<void> {
        const entityType = await this.entityTypeRepository.findById(entity_type_id);
        if (!entityType || entityType.is_deleted) {
            throw new NotFoundException('Entity type not found');
        }
        if (entityType.collection_id !== collection_id) {
            throw new NotFoundException('Entity type not found in this collection');
        }
    }

    async create(
        org_id: string,
        collection_id: string,
        entity_type_id: string,
        dto: EntityPropertyDTO,
    ): Promise<EntityPropertyDTO> {
        await this.validateCollectionOwnership(collection_id, org_id);
        await this.validateEntityType(entity_type_id, collection_id);
        const entityProperty = await this.entityPropertyRepository.create(dto.toSchema(collection_id, entity_type_id));
        return EntityPropertyDTO.fromSchema(entityProperty);
    }

    async findById(id: string): Promise<EntityProperties> {
        const entityProperty = await this.entityPropertyRepository.findById(id);
        if (!entityProperty || entityProperty.is_deleted) {
            throw new NotFoundException('Entity property not found');
        }
        return entityProperty;
    }

    async findByEntityTypeId(
        org_id: string,
        collection_id: string,
        entity_type_id: string,
    ): Promise<EntityPropertyDTO[]> {
        await this.validateCollectionOwnership(collection_id, org_id);
        await this.validateEntityType(entity_type_id, collection_id);
        const properties = await this.entityPropertyRepository.findByEntityTypeId(entity_type_id);
        return properties.map(p => EntityPropertyDTO.fromSchema(p));
    }

    async update(
        org_id: string,
        collection_id: string,
        entity_type_id: string,
        id: string,
        dto: EntityPropertyDTO,
    ): Promise<EntityPropertyDTO> {
        await this.validateCollectionOwnership(collection_id, org_id);
        await this.validateEntityType(entity_type_id, collection_id);
        await this.findById(id);
        const updateData = dto.toSchema(collection_id, entity_type_id);
        const updated = await this.entityPropertyRepository.update(id, updateData);
        return EntityPropertyDTO.fromSchema(updated);
    }

    async delete(
        org_id: string,
        collection_id: string,
        entity_type_id: string,
        id: string,
    ): Promise<EntityPropertyDTO> {
        await this.validateCollectionOwnership(collection_id, org_id);
        await this.validateEntityType(entity_type_id, collection_id);
        await this.findById(id);
        const deleted = await this.entityPropertyRepository.delete(id);
        return EntityPropertyDTO.fromSchema(deleted);
    }
}
