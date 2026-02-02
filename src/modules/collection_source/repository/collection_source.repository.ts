import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CollectionSource, CollectionSourceDocument } from '@modules/collection_source/domain/entities/collection_source.scheme';

@Injectable()
export class CollectionSourceRepository {
    private readonly logger = new Logger(CollectionSourceRepository.name);

    constructor(
        @InjectModel(CollectionSource.name)
        private readonly collectionSourceModel: Model<CollectionSourceDocument>,
    ) { }

    async create(collectionSource: CollectionSource): Promise<CollectionSource> {
        return this.collectionSourceModel.create(collectionSource);
    }

    async findById(id: string): Promise<CollectionSource | null> {
        return this.collectionSourceModel.findById(id);
    }

    async update(id: string, updateData: Partial<CollectionSource>): Promise<CollectionSource> {
        return this.collectionSourceModel.findByIdAndUpdate(id, { ...updateData, updated_at: new Date() }, { new: true });
    }

    async delete(id: string): Promise<CollectionSource> {
        return this.collectionSourceModel.findByIdAndUpdate(id, { is_deleted: true, updated_at: new Date() }, { new: true });
    }

    async findByCollectionIdAndName(collection_id: string, name: string): Promise<CollectionSource | null> {
        return this.collectionSourceModel.findOne({ collection_id, name, is_deleted: false });
    }

    async findByCollectionId(collection_id: string): Promise<CollectionSource[]> {
        return this.collectionSourceModel.find({ collection_id, is_deleted: false }).sort({ updated_at: -1 });
    }
}
