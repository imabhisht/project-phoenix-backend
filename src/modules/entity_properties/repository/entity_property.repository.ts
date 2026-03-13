import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityProperties, EntityPropertiesDocument } from '../domain/entities/entityProperties.scheme';

@Injectable()
export class EntityPropertyRepository {
    private readonly logger = new Logger(EntityPropertyRepository.name);

    constructor(
        @InjectModel(EntityProperties.name)
        private readonly entityPropertyModel: Model<EntityPropertiesDocument>,
    ) { }

    async create(entityProperty: EntityProperties): Promise<EntityProperties> {
        return this.entityPropertyModel.create(entityProperty);
    }

    async findById(id: string): Promise<EntityProperties | null> {
        return this.entityPropertyModel.findById(id);
    }

    async findByEntityTypeId(entity_type_id: string): Promise<EntityProperties[]> {
        return this.entityPropertyModel.find({ entity_type_id, is_deleted: false }).sort({ updated_at: -1 });
    }

    async findByCollectionId(collection_id: string): Promise<EntityProperties[]> {
        return this.entityPropertyModel.find({ collection_id, is_deleted: false }).sort({ updated_at: -1 });
    }

    async update(id: string, updateData: Partial<EntityProperties>): Promise<EntityProperties> {
        return this.entityPropertyModel.findByIdAndUpdate(
            id,
            { ...updateData, updated_at: new Date() },
            { new: true },
        );
    }

    async delete(id: string): Promise<EntityProperties> {
        return this.entityPropertyModel.findByIdAndUpdate(
            id,
            { is_deleted: true, updated_at: new Date() },
            { new: true },
        );
    }

    async deleteByEntityTypeId(entity_type_id: string): Promise<void> {
        await this.entityPropertyModel.updateMany(
            { entity_type_id, is_deleted: false },
            { is_deleted: true, updated_at: new Date() },
        );
    }
}
