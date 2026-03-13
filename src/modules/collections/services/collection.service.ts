import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CollectionRepository } from '../repository/collection.repository';
import { CollectionDTO } from '../dtos/collection.dto';
import { Collection } from '../domain/entities/collection.schema';
import { CollectionSourceRepository } from '@modules/collection_source/repository/collection_source.repository';
import { MediaUploadCollectionSourceData } from '@modules/collection_source/domain/entities/data/media_upload/media_upload.collection_source.scheme';
import { CollectionSource } from '@modules/collection_source/domain/entities/collection_source.scheme';
import { JwtUser } from '@shared/interfaces/jwt-user.interface';


@Injectable()
export class CollectionService {
    private readonly logger = new Logger(CollectionService.name);

    constructor(
        private readonly collectionRepository: CollectionRepository,
        private readonly collectionSourceRepository: CollectionSourceRepository
    ) { }

    async create(user: JwtUser, createCollectionDTO: CollectionDTO): Promise<CollectionDTO> {
        const collection = await this.collectionRepository.create(createCollectionDTO.toSchema(user.org_id, user.sub));
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

    async update(user: JwtUser, id: string, updateCollectionDTO: CollectionDTO): Promise<CollectionDTO> {
        await this.findById(id);
        const updateData = updateCollectionDTO.toSchema(user.org_id, user.sub);
        const updatedCollection = await this.collectionRepository.update(id, updateData);
        return CollectionDTO.fromSchema(updatedCollection);
    }

    async delete(id: string): Promise<CollectionDTO> {
        await this.findById(id);
        const deletedCollection = await this.collectionRepository.delete(id);
        return CollectionDTO.fromSchema(deletedCollection);
    }
}

