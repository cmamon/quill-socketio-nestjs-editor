import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type DocumentDocument = Document & MongooseDocument;

@Schema()
export class Document {
  @Prop()
  _id: string;

  @Prop({ type: Object, default: '' })
  content: object;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
