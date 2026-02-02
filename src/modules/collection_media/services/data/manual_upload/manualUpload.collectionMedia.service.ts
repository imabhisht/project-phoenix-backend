import { CollectionMedia } from "@modules/collection_media/domain/entities/collection_media.scheme";
import { MediaUploadCollectionMediaData } from "@modules/collection_media/domain/entities/data/media_upload/media_upload.collection_data.scheme";
import { CollectionMediaDTO } from "@modules/collection_media/dtos/collection_media.dto";
import { MediaUploadCollectionMediaDataDTO } from "@modules/collection_media/dtos/data/media_upload/media_upload.collection_media.dto";
import { CollectionMediaRepository } from "@modules/collection_media/repository/collection_media.repository";
import { Media } from "@modules/media/domain/entities/media.scheme";
import { MediaRepository } from "@modules/media/repository/media.repository";
import { Injectable, Logger } from "@nestjs/common";
import { BaseCollectionMediaDataDTO } from "@modules/collection_media/dtos/data/baseCollectionMediaData";
@Injectable()
export class ManualUploadCollectionMediaService {
    private readonly logger = new Logger(ManualUploadCollectionMediaService.name);

    constructor(
        private readonly collectionMediaRepository: CollectionMediaRepository,
        private readonly mediaRepository: MediaRepository,
    ) { }

    async createCollectionMedia(baseCollectionMediaDataDTO: BaseCollectionMediaDataDTO): Promise<MediaUploadCollectionMediaData> {
        const mediaUploadCollectionMediaDataDTO = baseCollectionMediaDataDTO as MediaUploadCollectionMediaDataDTO;
        const mediaUploadCollectionMediaData = new MediaUploadCollectionMediaData(mediaUploadCollectionMediaDataDTO.media_id);
        return mediaUploadCollectionMediaData;
    }

    async getCollectionMediasByCollectionSourceId(collection_source_id: string): Promise<CollectionMediaDTO[]> {
        const collectionMedias = await this.collectionMediaRepository.findByCollectionSourceId(collection_source_id);
        const mediaIds = collectionMedias.map((x) => (x.data as MediaUploadCollectionMediaData).media_id);
        const medias = await this.mediaRepository.findByIds(mediaIds);

        const mediaMap = new Map<string, Media>();

        medias.forEach((x) => {
            mediaMap.set(x._id, x);
        });

        return collectionMedias.map((collectionMedia) => {
            const mediaId = (collectionMedia.data as MediaUploadCollectionMediaData).media_id;
            const media = mediaMap.get(mediaId);
            return CollectionMediaDTO.fromSchema(
                collectionMedia,
                new MediaUploadCollectionMediaDataDTO().fromSchema(collectionMedia.data, media)
            );
        });
    }
}