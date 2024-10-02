import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {UsersService} from './users/users.service';
import {UsersModule} from './users/users.module';
import {PrismaService} from './prisma/prisma.service';
import {PrismaModule} from './prisma/prisma.module';
import {ChatModule} from './chat/chat.module';
import {GameModule} from './game/game.module';
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    imports: [AuthModule, UsersModule, PrismaModule, ChatModule, GameModule, ScheduleModule.forRoot()],
    controllers: [AppController],
    providers: [AppService, UsersService, PrismaService],
})
export class AppModule {
}
