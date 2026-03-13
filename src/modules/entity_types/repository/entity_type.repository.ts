import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityTypes, EntityTypesDocument } from '../domain/entities/entityTypes.scheme';

@Injectable()
export class EntityTypeRepository {
    private readonly logger = new Logger(EntityTypeRepository.name);

    constructor(
        @InjectModel(EntityTypes.name)
        private readonly entityTypeModel: Model<EntityTypesDocument>,
    ) { }

    async create(entityType: EntityTypes): Promise<EntityTypes> {
        return this.entityTypeModel.create(entityType);
    }

    async findById(id: string): Promise<EntityTypes | null> {
        return this.entityTypeModel.findById(id);
    }

    async findByCollectionId(collection_id: string): Promise<EntityTypes[]> {
        return this.entityTypeModel.find({ collection_id, is_deleted: false }).sort({ updated_at: -1 });
    }

    async update(id: string, updateData: Partial<EntityTypes>): Promise<EntityTypes> {
        return this.entityTypeModel.findByIdAndUpdate(
            id,
            { ...updateData, updated_at: new Date() },
            { new: true },
        );
    }

    async delete(id: string): Promise<EntityTypes> {
        return this.entityTypeModel.findByIdAndUpdate(
            id,
            { is_deleted: true, updated_at: new Date() },
            { new: true },
        );
    }
}
