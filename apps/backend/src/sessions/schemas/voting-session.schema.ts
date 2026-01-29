import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class VotingSession {
  @Prop({ required: true, unique: true, index: true })
  sessionId: string;

  @Prop({ type: [Types.ObjectId], default: [] })
  votedCharacterIds: Types.ObjectId[];

  @Prop({ required: true, index: { expireAfterSeconds: 0 } })
  expiresAt: Date;

  @Prop()
  lastActivityAt: Date;
}

export type VotingSessionDocument = VotingSession & Document;

export const VotingSessionSchema = SchemaFactory.createForClass(VotingSession);
