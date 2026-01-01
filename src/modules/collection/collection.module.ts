import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from './domain/entities/collection.schema';
import { CollectionController } from './controllers/collection.controller';
import { CollectionService } from './services/collection.service';
import { CollectionRepository } from './repository/collection.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Collection.name, schema: CollectionSchema },
        ]),
    ],
    controllers: [CollectionController],
    providers: [CollectionService, CollectionRepository],
    exports: [CollectionService],
})
export class CollectionModule { }
