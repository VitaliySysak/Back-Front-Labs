import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'orders' })
export class Orders {
  @Prop({ type: String, required: true })
  from: string;

  @Prop({ type: String, required: true })
  to: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  createdAt: string;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: String, required: true })
  distance: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, required: true })
  id: string;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);

export type OrdersLeanDoc = Orders & { _id: Types.ObjectId };
export type OrdersDoc = Orders & Document;
