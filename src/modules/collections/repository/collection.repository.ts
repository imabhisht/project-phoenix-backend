import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collection, CollectionDocument } from '@modules/collections/domain/entities/collection.schema';

@Injectable()
export class CollectionRepository {
    private readonly logger = new Logger(CollectionRepository.name);

    constructor(
        @InjectModel(Collection.name)
        private readonly collectionModel: Model<CollectionDocument>,
    ) { }

    async create(collection: Collection): Promise<Collection> {
        return this.collectionModel.create(collection);
    }

    async findById(id: string): Promise<Collection | null> {
        return this.collectionModel.findById(id);
    }

    async findByOrgId(org_id: string): Promise<Collection[]> {
        return this.collectionModel.find({ org_id, is_deleted: false }).sort({ updated_at: -1 });
    }

    async update(id: string, updateData: Partial<Collection>): Promise<Collection> {
        return this.collectionModel.findByIdAndUpdate(id, { ...updateData, updated_at: new Date() }, { new: true });
    }

    async delete(id: string): Promise<Collection> {
        return this.collectionModel.findByIdAndUpdate(id, { is_deleted: true, updated_at: new Date() }, { new: true });
    }
}
