import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'links' })
export class Links {
  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  originalLink: string;

  @Prop({ type: String, required: true })
  shortLink: string;

  @Prop({ type: Date, required: true })
  expiredAt: Date;
}

export const LinksSchema = SchemaFactory.createForClass(Links);

LinksSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

export type LinksLeanDoc = Links & { _id: Types.ObjectId };
export type LinksDoc = Links & Document;
