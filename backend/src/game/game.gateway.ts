import {ConnectedSocket, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway} from '@nestjs/websockets';
import {GameService} from "./game.service";
import {AuthedWebSocket} from "../auth/auth.gateway";
import {PongPlayer} from "./objs/pong-player";

@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect {

    constructor(private gameService: GameService) {
    }

    @SubscribeMessage('game_ping')
    handleGamePing(@ConnectedSocket() client: AuthedWebSocket) {
        this.gameService.updateGameUser(client)
    }

    @SubscribeMessage('game_up')
    handleGameUp(@ConnectedSocket() client:AuthedWebSocket) {
        for (let match of this.gameService.getMatches()) {
            if (match.getOpponent1().getUser().getId() === client.user.id) {
                if (!match.getOpponent1().isCollidingUp()) {
                    match.getOpponent1().getPos().y -= PongPlayer.PLAYER_SPEED;
                }
                break;
            }
            if (match.getOpponent2().getUser().getId() === client.user.id) {
                if (!match.getOpponent2().isCollidingUp()) {
                    match.getOpponent2().getPos().y -= PongPlayer.PLAYER_SPEED;
                    break;
                }
            }
        }
    }

    @SubscribeMessage('game_down')
    handleGameDown(@ConnectedSocket() client:AuthedWebSocket) {
        for (let match of this.gameService.getMatches()) {
            if (match.getOpponent1().getUser().getId() === client.user.id) {
                if (!match.getOpponent1().isCollidingDown()) {
                    match.getOpponent1().getPos().y += PongPlayer.PLAYER_SPEED;
                }
                break;
            }
            if (match.getOpponent2().getUser().getId() === client.user.id) {
                if (!match.getOpponent2().isCollidingDown()) {
                    match.getOpponent2().getPos().y += PongPlayer.PLAYER_SPEED;
                    break;
                }
            }
        }
    }

    handleDisconnect(client: AuthedWebSocket): any {
        if (!client.user) {
            return;
        }

        this.gameService.removeGameUser(client.user.id);
    }

}
