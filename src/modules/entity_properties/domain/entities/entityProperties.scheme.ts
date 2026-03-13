import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IdentifiableEntity } from '@shared/scheme/IdentifiableEntity.scheme';
import { EntityPropertiesDataTypeEnum } from '../enums/entityPropertiesDataTypes.enum';

export class EntityPropertiesData {
    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: String, default: null })
    description: string | null = null;

    @Prop({ required: true, type: String, enum: Object.values(EntityPropertiesDataTypeEnum) })
    data_type: EntityPropertiesDataTypeEnum;

    @Prop({ required: true, type: Boolean, default: false })
    is_required: boolean = false;

    @Prop({ required: true, type: Boolean, default: false })
    is_array: boolean = false;

    @Prop({ required: true, type: Boolean, default: false })
    is_nullable: boolean = false;

    @Prop({ required: true, type: String, default: null })
    default_value: string | null = null;

    @Prop({ required: false, type: Boolean, default: false })
    is_searchable: boolean = false;

    @Prop({ required: false, type: Boolean, default: false })
    is_filterable: boolean = false;

    @Prop({ required: false, type: Boolean, default: false })
    is_sortable: boolean = false;

    @Prop({ required: false, type: Boolean, default: false })
    is_facetable: boolean = false;

    @Prop({ required: false, type: Boolean, default: false })
    is_vectorizable: boolean = false;    
}

@Schema({ collection: 'entity_properties' })
export class EntityProperties extends IdentifiableEntity {

    @Prop({ required: true, type: String })
    collection_id: string;

    @Prop({ required: true, type: String })
    entity_type_id: string;

    @Prop({ required: true, type: EntityPropertiesData, default: null })
    property_data: EntityPropertiesData | null = null;
    
    @Prop({ required: true, type: Boolean, default: false })
    is_deleted: boolean;

    @Prop({ required: true, type: Date, default: () => new Date() })
    created_at: Date;

    @Prop({ required: true, type: Date, default: () => new Date() })
    updated_at: Date;
    
    constructor(){
        super();
        this.is_deleted = false;
    }
}

export const EntityPropertiesSchema = SchemaFactory.createForClass(EntityProperties);
export type EntityPropertiesDocument = EntityProperties & Document;