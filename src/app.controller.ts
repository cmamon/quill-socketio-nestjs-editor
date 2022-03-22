import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DocumentsService } from './documents/documents.service';

@Controller()
export class AppController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async redirect(@Res() res: Response) {
    const documentId = this.documentsService.createDocumentId();
    await this.documentsService.findOrCreateDocument(documentId);

    return res.redirect(`/documents/${documentId}`);
  }
}
