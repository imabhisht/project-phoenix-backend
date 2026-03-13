import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IdentifiableEntity } from '@shared/scheme/IdentifiableEntity.scheme';
import { EntityIdStrategyEnum } from '../enums/entityIdStrategy.enum';

export class EntityTypesData {
    @Prop({ type: String, enum: Object.values(EntityIdStrategyEnum), default: EntityIdStrategyEnum.SOURCE_ID })
    entity_id_strategy: EntityIdStrategyEnum;

    @Prop({ type: Number, default: 1 })
    schema_version: number = 1;

    constructor() {
        this.entity_id_strategy = EntityIdStrategyEnum.SOURCE_ID;
        this.schema_version = 1;
    }
}

@Schema({ collection: 'entity_types' })
export class EntityTypes extends IdentifiableEntity {
    @Prop({ required: true, type: String })
    collection_id: string;

    @Prop({ required: true, type: String, default: '' })
    name: string = '';

    @Prop({ required: true, type: String, default: '' })
    display_name: string = '';

    @Prop({ type: String, default: '' })
    description: string = '';

    @Prop({ type: EntityTypesData, default: null })
    entity_data: EntityTypesData | null = null;

    @Prop({ required: true, type: Boolean, default: false })
    is_deleted: boolean;

    @Prop({ required: true, type: Date, default: () => new Date() })
    created_at: Date;

    @Prop({ required: true, type: Date, default: () => new Date() })
    updated_at: Date;
}

export const EntityTypesSchema = SchemaFactory.createForClass(EntityTypes);
export type EntityTypesDocument = EntityTypes & Document;