import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'pages' })
export class Pages {
  @Prop({type: String, required: true})
  bookId: string;
  
  @Prop({type: String, required: true})
  url: string;

  @Prop({ type: Number, required: true})
  pageNumber: number;

  @Prop({ type: Number, required: true})
  TotalCount: number;
}

export const PagesSchema = SchemaFactory.createForClass(Pages);

export type PagesLeanDoc = Pages & { _id: Types.ObjectId };
export type PagesDoc = Pages & Document;
