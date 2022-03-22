import { Controller, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async findAll() {
    return await this.documentsService.findAll();
  }

  @Get('new')
  async redirect(@Res() res: Response) {
    const documentId = this.documentsService.createDocumentId();
    await this.documentsService.findOrCreateDocument(documentId);

    return res.redirect(`/documents/${documentId}`);
  }

  @Get(':id')
  async root(@Param() document: { id: string }, @Res() res: Response) {
    const documentId = document.id;
    const existingDocument = await this.documentsService.findOneById(
      documentId,
    );

    if (existingDocument) {
      return res.render('index', { documentId });
    }

    const newDocumentUrl = `${this.configService.get('APP_URL')}/documents/new`;

    return res.render('not-found', { documentId, newDocumentUrl });
  }
}
