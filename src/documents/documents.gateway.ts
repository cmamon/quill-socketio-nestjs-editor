import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { DocumentsService } from './documents.service';

@WebSocketGateway({
  namespace: 'documents',
})
export class DocumentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private documentsService: DocumentsService) {}

  @WebSocketServer()
  server: Server;
  nbClientsConnected = 0;

  afterInit(server: any) {
    Logger.log(
      `[Document Gateway] Document Gateway initialized at ${server.name}`,
    );
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.nbClientsConnected++;
    Logger.log(
      `[Document Gateway] Client ${client.id} connected - currently ${this.nbClientsConnected} client(s) connected`,
    );

    client.on('get-document', async (documentId) => {
      const document = await this.documentsService.findOrCreateDocument(
        documentId,
      );

      client.join(documentId);
      Logger.log(
        `[Document Gateway] Client ${client.id} has joined document ${documentId}`,
      );

      client.emit('load-document', document.content);

      client.on('text-change', (delta: object) => {
        client.broadcast.to(documentId).emit('text-change', delta);
      });

      client.on('save-document', async (content) => {
        await this.documentsService.saveDocument(documentId, content);
      });
    });
  }

  handleDisconnect(client: Socket) {
    this.nbClientsConnected--;
    const nbClientsConnectedString =
      this.nbClientsConnected === 0
        ? 'No clients connected'
        : `currently ${this.nbClientsConnected} client(s) connected`;

    Logger.log(
      `[Document Gateway] Client ${client.id} disconnected - ${nbClientsConnectedString}`,
    );
  }
}
