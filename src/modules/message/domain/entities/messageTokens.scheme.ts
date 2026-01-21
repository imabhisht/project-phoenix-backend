import { Prop } from '@nestjs/mongoose';

export class MessageTokens {
    @Prop({ type: String, default: null })
    trace_id: string | null;

    @Prop({ type: Number, default: null })
    prompt_tokens: number | null;

    @Prop({ type: Number, default: null })
    completion_tokens: number | null;

    @Prop({ type: Number, default: null })
    total_tokens: number | null;
}
