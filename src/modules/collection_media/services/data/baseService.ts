import { BaseCollectionMediaDataDTO } from "@modules/collection_media/dtos/data/baseCollectionMediaData";
import { BaseCollectionMediaData } from "@modules/collection_media/domain/entities/data/baseData";
import { CollectionMediaDTO } from "@modules/collection_media/dtos/collection_media.dto";

export interface IBaseCollectionMediaDataService {
    getCollectionMediasByCollectionSourceId(collection_source_id: string): Promise<CollectionMediaDTO[]>;
    createCollectionMedia(baseCollectionMediaDataDTO: BaseCollectionMediaDataDTO): Promise<BaseCollectionMediaData>;
}