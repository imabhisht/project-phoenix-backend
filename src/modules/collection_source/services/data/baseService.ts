import { BaseCollectionSourceData } from "@modules/collection_source/domain/entities/data/baseData";
import { BaseCollectionSourceDataDTO } from "@modules/collection_source/dtos/data/baseData.collection_source";

// Base interface with common methods that all services must implement
export interface IBaseCollectionSourceDataService {
    create(data: BaseCollectionSourceDataDTO): Promise<BaseCollectionSourceData>;
}

// Google Drive specific interface for OAuth operations
export interface IGoogleDriveCollectionSourceService extends IBaseCollectionSourceDataService {
    googleOAuth2GenerateAuthUrl(collectionSourceId: string): Promise<string>;
    googleOAuth2Callback(code: string, state: string): Promise<void>;
}