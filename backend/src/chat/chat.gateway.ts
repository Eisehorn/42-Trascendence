import {
    ConnectedSocket,
    MessageBody,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {Server} from 'ws';
import {AuthedWebSocket} from '../auth/auth.gateway';
import {ChatService} from "./chat.service";

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    constructor(private chatService: ChatService) {
    }

    @SubscribeMessage('chat_connect')
    handleConnectedMessage(@ConnectedSocket() client: AuthedWebSocket) {
        if (!client.user) {
            return;
        }

        this.chatService.addConnectedUser(client);
    }

    @SubscribeMessage('chat_msg_send')
    async handleChatMessageSend(@ConnectedSocket() client: AuthedWebSocket, @MessageBody() payload: any) {
        if (!client.user) {
            return;
        }

        if (!payload["channel_id"] || !payload["message"]) {
            return;
        }

        const channel = await this.chatService.getChannel(payload["channel_id"])
        if (!channel) {
            return;
        }

        if (await this.chatService.isMutedInChannel(client.user, channel.id)) {
            return;
        }

        await this.chatService.sendMessage(channel, client.user, payload["message"]);
    }

    handleDisconnect(client: AuthedWebSocket) {
        if (!client.user) {
            return;
        }

        this.chatService.removeConnectedUser(client);
    }

}
