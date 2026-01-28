import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VoteDocument = Vote & Document;

@Schema({ timestamps: true, collection: 'votes' })
export class Vote {
  @Prop({ type: Types.ObjectId, ref: 'Character', required: true, index: true })
  characterId: Types.ObjectId;

  @Prop({ required: true })
  characterName: string;

  @Prop({ required: true })
  source: string;

  @Prop({
    required: true,
    enum: ['like', 'dislike'],
    index: true,
  })
  voteType: 'like' | 'dislike';

  @Prop({ required: true, default: Date.now, index: true })
  votedAt: Date;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
