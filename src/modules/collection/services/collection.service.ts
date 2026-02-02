import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CollectionRepository } from '../repository/collection.repository';
import { CollectionDTO } from '../dtos/collection.dto';
import { Collection } from '../domain/entities/collection.schema';
import { CollectionSourceRepository } from '@modules/collection_source/repository/collection_source.repository';
import { MediaUploadCollectionSourceData } from '@modules/collection_source/domain/entities/data/media_upload/media_upload.collection_source.scheme';
import { CollectionSource } from '@modules/collection_source/domain/entities/collection_source.scheme';
import { FirebaseUser } from '@shared/interfaces';
import { CollectionOverviewDTO } from '../dtos/collectionOverview.dto';


@Injectable()
export class CollectionService {
    private readonly logger = new Logger(CollectionService.name);

    constructor(
        private readonly collectionRepository: CollectionRepository,
        private readonly collectionSourceRepository: CollectionSourceRepository
    ) { }

    async create(user: FirebaseUser, createCollectionDTO: CollectionDTO): Promise<CollectionDTO> {
        const collection = await this.collectionRepository.create(createCollectionDTO.toSchema(user.organization_id, user.user_id))

        const manualUploadCollectionSource = new MediaUploadCollectionSourceData()
        const collectionSource = new CollectionSource()
        collectionSource.collection_id = collection._id
        collectionSource.name = `Manual Upload`
        collectionSource.data = manualUploadCollectionSource

        await this.collectionSourceRepository.create(collectionSource)

        return CollectionDTO.fromSchema(collection);
    }

    async findById(id: string): Promise<Collection | null> {
        const collection = await this.collectionRepository.findById(id);
        if (!collection) {
            throw new NotFoundException('Collection not found');
        }
        return collection;
    }

    async getCollectionsByOrgId(org_id: string): Promise<CollectionDTO[]> {
        const collections = await this.collectionRepository.findByOrgId(org_id);
        return collections.map(collection => CollectionDTO.fromSchema(collection));
    }

    async update(user: FirebaseUser, id: string, updateCollectionDTO: CollectionDTO): Promise<CollectionDTO> {
        await this.findById(id);
        const updateData = updateCollectionDTO.toSchema(user.organization_id, user.user_id);
        const updatedCollection = await this.collectionRepository.update(id, updateData);
        return CollectionDTO.fromSchema(updatedCollection);
    }

    async delete(id: string): Promise<CollectionDTO> {
        await this.findById(id);
        const deletedCollection = await this.collectionRepository.delete(id);
        return CollectionDTO.fromSchema(deletedCollection);
    }

    async getCollectionOverview(id: string): Promise<CollectionOverviewDTO> {
        const collection = await this.collectionRepository.findById(id);
        if (!collection) {
            throw new NotFoundException('Collection not found');
        }
        const collectionSources = await this.collectionSourceRepository.findByCollectionId(collection._id);
        return CollectionOverviewDTO.fromSchema(collection, collectionSources);
    }
}

