import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionSource, CollectionSourceSchema } from './domain/entities/collection_source.scheme';
import { CollectionSourceController } from './controllers/collection_source.controller';
import { CollectionSourceService } from './services/collection_source.service';
import { CollectionSourceRepository } from './repository/collection_source.repository';
import { CollectionSourceDataServiceFactory } from './services/data/serviceFactory';
import { AWS_S3CollectionSourceService } from './services/data/aws_s3/aws_s3.collection_source.service';
import { GoogleDriveCollectionSourceService } from './services/data/google_drive/google_drive.collection_source.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CollectionSource.name, schema: CollectionSourceSchema },
        ]),
    ],
    controllers: [CollectionSourceController],
    providers: [
        CollectionSourceService,
        CollectionSourceRepository,
        CollectionSourceDataServiceFactory,
        AWS_S3CollectionSourceService,
        GoogleDriveCollectionSourceService,
    ],
    exports: [CollectionSourceService],
})
export class CollectionSourceModule { }
