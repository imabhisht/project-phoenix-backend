import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CollectionRepository } from '../repository/collection.repository';
import { CollectionDTO } from '../dtos/collection.dto';
import { Collection } from '../domain/entities/collection.schema';

@Injectable()
export class CollectionService {
    private readonly logger = new Logger(CollectionService.name);

    constructor(
        private readonly collectionRepository: CollectionRepository,
    ) { }

    async create(createCollectionDTO: CollectionDTO): Promise<CollectionDTO> {
        const newCollection = await this.collectionRepository.create(createCollectionDTO.toSchema());
        return CollectionDTO.fromSchema(newCollection);
    }

    async findById(id: string): Promise<CollectionDTO> {
        const collection = await this.collectionRepository.findById(id);
        return CollectionDTO.fromSchema(collection);
    }

    async findByOrgId(org_id: string): Promise<CollectionDTO[]> {
        const collections = await this.collectionRepository.findByOrgId(org_id);
        return collections.map(collection => CollectionDTO.fromSchema(collection));
    }

    async update(id: string, updateCollectionDTO: CollectionDTO): Promise<CollectionDTO> {
        await this.findById(id);
        const updateData = updateCollectionDTO.toSchema();
        const updatedCollection = await this.collectionRepository.update(id, updateData);
        return CollectionDTO.fromSchema(updatedCollection);
    }

    async delete(id: string): Promise<CollectionDTO> {
        await this.findById(id);
        const deletedCollection = await this.collectionRepository.delete(id);
        return CollectionDTO.fromSchema(deletedCollection);
    }
}
