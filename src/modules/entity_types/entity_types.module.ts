import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntityTypes, EntityTypesSchema } from './domain/entities/entityTypes.scheme';
import { EntityTypeController } from './controllers/entity_type.controller';
import { EntityTypeService } from './services/entity_type.service';
import { EntityTypeRepository } from './repository/entity_type.repository';
import { CollectionModule } from '@modules/collections/collection.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: EntityTypes.name, schema: EntityTypesSchema },
        ]),
        CollectionModule,
    ],
    controllers: [EntityTypeController],
    providers: [EntityTypeService, EntityTypeRepository],
    exports: [EntityTypeService, EntityTypeRepository],
})
export class EntityTypesModule { }
