import { Prop, Schema } from '@nestjs/mongoose';
import { v7 as uuid } from 'uuid';

@Schema()
export class IdentifiableEntity {
    @Prop({ type: String, default: () => uuid() })
    _id: string;
}