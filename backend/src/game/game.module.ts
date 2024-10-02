import {forwardRef, Module} from '@nestjs/common';
import {GameService} from './game.service';
import {GameController} from './game.controller';
import {GameGateway} from './game.gateway';
import {AuthModule} from "../auth/auth.module";
import {PrismaModule} from "../prisma/prisma.module";

@Module({
    providers: [GameService, GameGateway],
    controllers: [GameController],
    exports: [GameService],
    imports: [forwardRef(() => AuthModule), PrismaModule]
})
export class GameModule {
}
