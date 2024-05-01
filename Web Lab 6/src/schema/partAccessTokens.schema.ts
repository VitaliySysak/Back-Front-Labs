import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'partAccessToken' })
export class PartAccessTokens {
  @Prop({type: String, required: true})
  partId: string;
  
  @Prop({type: String, required: true})
  otp: string;
}

export const PartAccessTokensSchema = SchemaFactory.createForClass(PartAccessTokens);

export type PartAccessTokensLeanDoc = PartAccessTokens & { _id: Types.ObjectId };
export type PartAccessTokensDoc = PartAccessTokens & Document;
