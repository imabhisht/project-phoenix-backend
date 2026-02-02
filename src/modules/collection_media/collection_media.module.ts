import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionMedia, CollectionMediaSchema } from './domain/entities/collection_media.scheme';
import { CollectionSource, CollectionSourceSchema } from '@modules/collection_source/domain/entities/collection_source.scheme';
import { CollectionMediaController } from './controllers/collection_media.controller';
import { CollectionMediaService } from './services/collection_media.service';
import { CollectionMediaRepository } from './repository/collection_media.repository';
import { CollectionSourceRepository } from '@modules/collection_source/repository/collection_source.repository';
import { MediaRepository } from '@modules/media/repository/media.repository';
import { Media, MediaSchema } from '@modules/media/domain/entities/media.scheme';
import { CollectionSourceModule } from '@modules/collection_source/collection_source.module';
import { CollectionModule } from '@modules/collection/collection.module';
import { MediaModule } from '@modules/media/media.module';
import { CollectionMediaDataServiceFactory } from './services/data/serviceFactory';
import { ManualUploadCollectionMediaService } from './services/data/manual_upload/manualUpload.collectionMedia.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CollectionMedia.name, schema: CollectionMediaSchema },
            { name: CollectionSource.name, schema: CollectionSourceSchema },
            { name: Media.name, schema: MediaSchema },
        ]),
        CollectionSourceModule,
        CollectionModule,
        MediaModule,
    ],
    controllers: [CollectionMediaController],
    providers: [
        CollectionMediaService,
        CollectionMediaRepository,
        CollectionSourceRepository,
        MediaRepository,
        CollectionMediaDataServiceFactory,
        ManualUploadCollectionMediaService,
    ],
    exports: [CollectionMediaService],
})
export class CollectionMediaModule { }
