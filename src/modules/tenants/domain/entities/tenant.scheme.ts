import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IdentifiableEntity } from '@shared/scheme/IdentifiableEntity.scheme';

@Schema({ collection: 'tenant' })
export class Tenant extends IdentifiableEntity {
    @Prop({ required: true, type: String, unique: true })
    firebase_tenant_id: string;

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ type: String, default: null })
    description: string | null;

    @Prop({ type: Date, default: () => new Date() })
    created_at: Date;

    @Prop({ type: Date, default: () => new Date() })
    updated_at: Date;
}

export type TenantDocument = Tenant & Document;
export const TenantSchema = SchemaFactory.createForClass(Tenant);

// Create index for firebase_tenant_id for efficient lookups
TenantSchema.index({ firebase_tenant_id: 1 }, { unique: true });
