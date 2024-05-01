import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'parts' })
export class Parts {
  @Prop({type: String, required: true})
  pictureId: string;
  
  @Prop({type: Object, required: true})
  box: object;

  @Prop({ type: [Object], required: false})
  options: {text:string, count: number}[];
}

export const PartsSchema = SchemaFactory.createForClass(Parts);

export type PartsLeanDoc = Parts & { _id: Types.ObjectId };
export type PartsDoc = Parts & Document;
