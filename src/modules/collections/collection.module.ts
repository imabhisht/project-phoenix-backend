import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from './domain/entities/collection.schema';
import { CollectionSource, CollectionSourceSchema } from '@modules/collection_source/domain/entities/collection_source.scheme';
import { CollectionController } from './controllers/collection.controller';
import { CollectionService } from './services/collection.service';
import { CollectionRepository } from './repository/collection.repository';
import { CollectionSourceRepository } from '@modules/collection_source/repository/collection_source.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Collection.name, schema: CollectionSchema },
            { name: CollectionSource.name, schema: CollectionSourceSchema },
        ]),
    ],
    controllers: [CollectionController],
    providers: [CollectionService, CollectionRepository, CollectionSourceRepository],
    exports: [CollectionService, CollectionRepository],
})
export class CollectionModule { }
