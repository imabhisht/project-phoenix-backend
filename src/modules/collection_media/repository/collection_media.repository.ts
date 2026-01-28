import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Collection, Model } from 'mongoose';
import { CollectionMedia, CollectionMediaDocument } from '@modules/collection_media/domain/entities/collection_media.scheme';

@Injectable()
export class CollectionMediaRepository {
    constructor(
        @InjectModel(CollectionMedia.name)
        private readonly collectionMediaModel: Model<CollectionMediaDocument>,
    ) { }

    async create(collectionMedia: CollectionMedia): Promise<CollectionMedia> {
        return this.collectionMediaModel.create(collectionMedia);
    }

    async findById(id: string): Promise<CollectionMedia | null> {
        return this.collectionMediaModel.findById(id);
    }

    async findByCollectionId(collection_id: string): Promise<CollectionMedia[]> {
        return this.collectionMediaModel.find({ collection_id, is_deleted: false });
    }

    async update(id: string, updateData: Partial<CollectionMedia>): Promise<CollectionMedia> {
        return this.collectionMediaModel.findByIdAndUpdate(id, { ...updateData, updated_at: new Date() }, { new: true });
    }

    async delete(id: string): Promise<CollectionMedia> {
        return this.collectionMediaModel.findByIdAndUpdate(id, { is_deleted: true, updated_at: new Date() }, { new: true });
    }
}
