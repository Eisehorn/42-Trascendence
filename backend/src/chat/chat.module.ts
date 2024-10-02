import {Module} from '@nestjs/common';
import {ChatController} from './chat.controller';
import {ChatService} from './chat.service';
import {PrismaModule} from '../prisma/prisma.module';
import {AuthModule} from '../auth/auth.module';
import {ChatGateway} from './chat.gateway';
import {GameModule} from "../game/game.module";

@Module({
    controllers: [ChatController],
    providers: [ChatService, ChatGateway],
    imports: [PrismaModule, AuthModule, GameModule]
})
export class ChatModule {
}
