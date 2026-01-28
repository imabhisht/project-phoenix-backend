import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CollectionMedia, CollectionMediaDocument } from "../domain/entities/collection_media.scheme";
import { CollectionMediaRepository } from "../repository/collection_media.repository";

@Injectable()
export class CollectionMediaService {
    private readonly logger = new Logger(CollectionMediaService.name);

    constructor(
        private readonly collectionMediaRepository: CollectionMediaRepository,
    ) {}

    async createCollectionMedia(collectionMedia: CollectionMedia): Promise<CollectionMedia> {
        return this.collectionMediaRepository.create(collectionMedia);
    }

    async getCollectionMedia(id: string): Promise<CollectionMedia> {
        return this.collectionMediaRepository.findById(id);
    }
}