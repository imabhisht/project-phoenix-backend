import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IdentifiableEntity } from '@shared/scheme/IdentifiableEntity.scheme';
import { UserRoles } from '../enums/userRoles.enum';

@Schema({ collection: 'users' })
export class User extends IdentifiableEntity {
    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: String })
    organization_id: string;

    @Prop({ required: true, type: String })
    email: string;

    @Prop({ required: true, type: String })
    username: string;

    @Prop({ required: true, type: String })
    role: UserRoles;

    @Prop({ type: Date, default: () => new Date() })
    created_at: Date;

    @Prop({ type: Date, default: () => new Date() })
    updated_at: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

// Create compound index for organization_id and email for efficient lookups
UserSchema.index({ organization_id: 1, email: 1 }, { unique: true });
// Create index for username for efficient lookups
UserSchema.index({ username: 1 }, { unique: true });
