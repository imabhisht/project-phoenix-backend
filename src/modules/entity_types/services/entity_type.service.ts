import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EntityTypeRepository } from '../repository/entity_type.repository';
import { EntityTypeDTO } from '../dtos/entity_type.dto';
import { EntityTypes } from '../domain/entities/entityTypes.scheme';
import { CollectionRepository } from '@modules/collections/repository/collection.repository';

@Injectable()
export class EntityTypeService {
    private readonly logger = new Logger(EntityTypeService.name);

    constructor(
        private readonly entityTypeRepository: EntityTypeRepository,
        private readonly collectionRepository: CollectionRepository,
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

    async create(org_id: string, dto: EntityTypeDTO): Promise<EntityTypeDTO> {
        await this.validateCollectionOwnership(dto.collection_id, org_id);
        const entityType = await this.entityTypeRepository.create(dto.toSchema(dto.collection_id));
        return EntityTypeDTO.fromSchema(entityType);
    }

    async findById(id: string): Promise<EntityTypes> {
        const entityType = await this.entityTypeRepository.findById(id);
        if (!entityType || entityType.is_deleted) {
            throw new NotFoundException('Entity type not found');
        }
        return entityType;
    }

    async findByCollectionId(org_id: string, collection_id: string): Promise<EntityTypeDTO[]> {
        await this.validateCollectionOwnership(collection_id, org_id);
        const entityTypes = await this.entityTypeRepository.findByCollectionId(collection_id);
        return entityTypes.map(entityType => EntityTypeDTO.fromSchema(entityType));
    }

    async update(org_id: string, id: string, dto: EntityTypeDTO): Promise<EntityTypeDTO> {
        await this.validateCollectionOwnership(dto.collection_id, org_id);
        const oldData = await this.findById(id);
        const updateData = dto.toSchema(dto.collection_id);
        updateData.created_at = oldData.created_at;
        const updated = await this.entityTypeRepository.update(id, updateData);
        return EntityTypeDTO.fromSchema(updated);
    }

    async delete(org_id: string, id: string): Promise<EntityTypeDTO> {
        const oldData = await this.findById(id);
        await this.validateCollectionOwnership(oldData.collection_id, org_id);
        const deleted = await this.entityTypeRepository.delete(id);
        return EntityTypeDTO.fromSchema(deleted);
    }
}
