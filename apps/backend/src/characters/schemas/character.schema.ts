import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CharacterDocument = Character & Document;

@Schema({ timestamps: true, collection: 'characters' })
export class Character {
  @Prop({ required: true, index: true })
  externalId: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['rick-morty', 'pokemon', 'superhero', 'star-wars'],
  })
  source: 'rick-morty' | 'pokemon' | 'superhero' | 'star-wars';

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);

CharacterSchema.index({ externalId: 1, source: 1 }, { unique: true });
