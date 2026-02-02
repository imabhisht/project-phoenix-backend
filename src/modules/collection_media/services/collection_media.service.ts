import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CollectionMedia, CollectionMediaDocument } from "../domain/entities/collection_media.scheme";
import { CollectionMediaRepository } from "../repository/collection_media.repository";
import { CollectionMediaDTO } from "../dtos/collection_media.dto";
import { CollectionMediaDataServiceFactory } from "./data/serviceFactory";
import { SourceTypeEnum } from "@modules/collection_source/domain/enums/source_types";
import { CollectionSourceRepository } from "@modules/collection_source/repository/collection_source.repository";
import { BaseCollectionMediaDataDTO } from "../dtos/data/baseCollectionMediaData";
import { CollectionService } from "@modules/collection/services/collection.service";
import { CollectionSourceService } from "@modules/collection_source/services/collection_source.service";
import { AIIndexingStatus } from "../domain/entities/ai_indexing_status.collection_media";
import { MediaUploadCollectionMediaData } from "../domain/entities/data/media_upload/media_upload.collection_data.scheme";
import { MediaUploadCollectionMediaDataDTO } from "../dtos/data/media_upload/media_upload.collection_media.dto";
import { MediaService } from "@modules/media/services/media.service";

@Injectable()
export class CollectionMediaService {
    private readonly logger = new Logger(CollectionMediaService.name);

    constructor(
        private readonly collectionSourceService: CollectionSourceService,
        private readonly collectionMediaRepository: CollectionMediaRepository,
        private readonly collectionMediaDataServiceFactory: CollectionMediaDataServiceFactory,
        private readonly collectionService: CollectionService,
        private readonly mediaService: MediaService,
    ) {}

    async createCollectionMedia(collectionMediaDTO: CollectionMediaDTO): Promise<CollectionMediaDTO> {
        const collection = await this.collectionService.findById(collectionMediaDTO.collection_id);
        if (!collection) {
            throw new NotFoundException(`Collection not found`);
        }
        const collectionSource = await this.collectionSourceService.findById(collectionMediaDTO.collection_source_id);
        if (!collectionSource) {
            throw new NotFoundException('Collection source not found');
        }

        const media = await this.mediaService.findById((collectionMediaDTO.data as MediaUploadCollectionMediaDataDTO).media_id);
        if (!media) {
            throw new NotFoundException('Media not found');
        }

        const provider = this.collectionMediaDataServiceFactory.getService(collectionSource.data.type);
        const baseCollectionMediaData = await provider.createCollectionMedia(collectionMediaDTO.data as BaseCollectionMediaDataDTO);

        const collectionMedia = new CollectionMedia();
        collectionMedia.collection_id = collection._id;
        collectionMedia.collection_source_id = collectionSource._id;
        collectionMedia.data = baseCollectionMediaData;
        collectionMedia.ai_indexing_status = new AIIndexingStatus();
        collectionMedia.user_id = collection.user_id;
        collectionMedia.is_deleted = false;
        const newCollectionMedia = await this.collectionMediaRepository.create(collectionMedia);

        const mediaUploadCollectionMediaDTO = new MediaUploadCollectionMediaDataDTO().fromSchema(baseCollectionMediaData, media);

        return CollectionMediaDTO.fromSchema(newCollectionMedia, mediaUploadCollectionMediaDTO);
    }   

    async getUsingCollectionId(collection_id: string): Promise<CollectionMediaDTO[]> {
        const collectionSources = await this.collectionSourceService.findByCollectionId(collection_id);
        const results: CollectionMediaDTO[] = [];
        collectionSources.forEach(async (x) => {
            const provider = this.collectionMediaDataServiceFactory.getService(x.data.type);
            const collectionMedias = await provider.getCollectionMediasByCollectionSourceId(x._id);
            results.push(...collectionMedias);
        });
        return results;
    }

    async getUsingCollectionSourceId(collection_source_id: string): Promise<CollectionMediaDTO[]> {
        const collectionSource = await this.collectionSourceService.findById(collection_source_id);
        if (!collectionSource) {
            throw new NotFoundException('Collection source not found');
        }
        const provider = this.collectionMediaDataServiceFactory.getService(collectionSource.data.type);
        return await provider.getCollectionMediasByCollectionSourceId(collectionSource._id);
    }
}