import {PongPosition} from "./pong-position";
import {GameUser} from "./game-user";
import {PongMatch} from "./pong-match";

export class PongPlayer {

    public player_height = 130
    public static PLAYER_WIDTH = 15
    public static PLAYER_SPEED = 5
    private pos: PongPosition = new PongPosition(0, 0);
    private score = 0

    constructor(private user: GameUser) {
    }

    getScore() {
        return this.score
    }

    addScore() {
       this.score += 1
    }

    getUser(): GameUser {
        return this.user;
    }

    getPos(): PongPosition {
        return this.pos;
    }

    isCollidingUp() {
        return this.pos.y - this.player_height / 2 <= 0;
    }

    isCollidingDown() {
        return this.pos.y + this.player_height / 2 >= PongMatch.SCREEN_HEIGHT;
    }

}
