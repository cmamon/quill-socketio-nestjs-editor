import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidV4 } from 'uuid';
import { Document, DocumentDocument } from './Document.schema';
import { Model } from 'mongoose';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<DocumentDocument>,
  ) {}

  createDocumentId(): string {
    const name = uuidV4();
    return name;
  }

  async findOneById(id: string) {
    return await this.documentModel.findById(id);
  }

  async findAll() {
    return this.documentModel.find();
  }

  async findOrCreateDocument(id: string) {
    if (id == null) return;

    const document = await this.documentModel.findById(id);

    if (document) {
      return document;
    }

    return await this.documentModel.create({ _id: id });
  }

  async saveDocument(documentId: string, content: object) {
    return await this.documentModel.findByIdAndUpdate(documentId, { content });
  }
}
