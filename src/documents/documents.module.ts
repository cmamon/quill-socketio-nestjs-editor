import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Document, DocumentSchema } from './Document.schema';
import { DocumentsController } from './documents.controller';
import { DocumentsGateway } from './documents.gateway';
import { DocumentsService } from './documents.service';

@Module({
  controllers: [DocumentsController],
  exports: [DocumentsGateway, DocumentsService],
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
    ]),
  ],
  providers: [DocumentsGateway, DocumentsService],
})
export class DocumentsModule {}
