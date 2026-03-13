import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntityProperties, EntityPropertiesSchema } from './domain/entities/entityProperties.scheme';
import { EntityPropertyController } from './controllers/entity_property.controller';
import { EntityPropertyService } from './services/entity_property.service';
import { EntityPropertyRepository } from './repository/entity_property.repository';
import { CollectionModule } from '@modules/collections/collection.module';
import { EntityTypesModule } from '@modules/entity_types/entity_types.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: EntityProperties.name, schema: EntityPropertiesSchema },
        ]),
        CollectionModule,
        EntityTypesModule,
    ],
    controllers: [EntityPropertyController],
    providers: [EntityPropertyService, EntityPropertyRepository],
    exports: [EntityPropertyService, EntityPropertyRepository],
})
export class EntityPropertiesModule { }
