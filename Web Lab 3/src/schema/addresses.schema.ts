import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'addresses' })
export class AddressesLocation {
  @Prop({ type: Number, required: true })
  longitude: number;

  @Prop({ type: Number, required: true })
  latitude: number
}
export const AddressesLocationSchema = SchemaFactory.createForClass(AddressesLocation);

@Schema({ collection: 'addresses' })
export class Addresses {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: AddressesLocationSchema, required: true })
  location: AddressesLocation
}

@Schema({ collection: 'addresses' })
export class startAddress {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: AddressesLocationSchema, required: true })
  location: AddressesLocation
}

export const AddressesSchema = SchemaFactory.createForClass(Addresses);

export type AddressesLeanDoc = Addresses & { _id: Types.ObjectId };
export type AddressesDoc = Addresses & Document;


