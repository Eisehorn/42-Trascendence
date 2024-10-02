import {PongBall} from "./pong-ball";
import {PongPlayer} from "./pong-player";
import {GameUser} from "./game-user";
import {PongPower} from "./pong-power";

export class PongMatch {

    public static SCREEN_WIDTH = 1920;
    public static SCREEN_HEIGHT = 1080;
    public static MAX_SCORE = 7;

    private opponent1: PongPlayer;
    private opponent2: PongPlayer;
    private ball: PongBall = new PongBall();
    private matchEnded = 0;
    private isNeon = false;
    private power: PongPower;
    private isPowerActive = false;

    constructor(gameUser1: GameUser, gameUser2: GameUser) {
        this.opponent1 = new PongPlayer(gameUser1);
        this.opponent2 = new PongPlayer(gameUser2);
    }

    getNeon() {
        return this.isNeon;
    }

    getPower() {
        return this.power;
    }

    getIsPowerActive() {
        return this.isPowerActive
    }

    setPower() {
        this.power = new PongPower((500 + Math.round(Math.random() * 920)), 200 + Math.round(Math.random()) * 680);
        this.isPowerActive = true;
    }

    activatePower(player: PongPlayer) {
        player.player_height = 200;
        this.isPowerActive = false;
    }

    getMatchEnded() {
        return this.matchEnded;
    }

    setMatchEnded(winner: number) {
        this.matchEnded = winner;
    }

    start() {
        const data = {
            event: 'game_start',
            data: {
                type: 'classic'
            }
        };
        this.opponent1.getUser().getSocket().send(JSON.stringify(data));
        this.opponent2.getUser().getSocket().send(JSON.stringify(data));

        this.opponent1.getPos().y = PongMatch.SCREEN_HEIGHT/2;
        this.opponent1.getPos().x = PongPlayer.PLAYER_WIDTH;
        this.opponent2.getPos().y = PongMatch.SCREEN_HEIGHT/2;
        this.opponent2.getPos().x = PongMatch.SCREEN_WIDTH - PongPlayer.PLAYER_WIDTH;
        this.ball.setDir();
        this.syncClients();
    }

    start_neon() {
        const data = {
            event: 'game_start',
            data: {
                type: 'neon'
            }
        };
        this.opponent1.getUser().getSocket().send(JSON.stringify(data));
        this.opponent2.getUser().getSocket().send(JSON.stringify(data));

        this.opponent1.getPos().y = PongMatch.SCREEN_HEIGHT/2;
        this.opponent1.getPos().x = PongPlayer.PLAYER_WIDTH;
        this.opponent2.getPos().y = PongMatch.SCREEN_HEIGHT/2;
        this.opponent2.getPos().x = PongMatch.SCREEN_WIDTH - PongPlayer.PLAYER_WIDTH;
        this.ball.setDir();
        this.isNeon = true;
        this.syncClients();
    }

    tick() {
        this.ball.tick(this);

        this.syncClients()
    }

    getOpponent1() {
        return this.opponent1;
    }

    getOpponent2() {
        return this.opponent2;
    }

    private syncClients() {
        const data = {
            event: "match_sync",
            data: {
				neon: this.isPowerActive,
                opponent1: {
                    is_me: false,
                    pos: this.opponent1.getPos(),
					height: this.opponent1.player_height,
                    score: this.opponent1.getScore()
                },
                opponent2: {
                    is_me: false,
                    pos: this.opponent2.getPos(),
					height: this.opponent2.player_height,
                    score: this.opponent2.getScore()
                },
                ball: {
                    pos: this.ball.getPos(),
                    dir: this.ball.getDir()
                },
                power: {
                    x: this.isPowerActive ? this.power.x : 0,
                    y: this.isPowerActive ? this.power.y : 0
                }
            }
        }



        data.data.opponent1.is_me = true;
        this.opponent1.getUser().getSocket().send(JSON.stringify(data));

        data.data.opponent1.is_me = false;
        data.data.opponent2.is_me = true;
        this.opponent2.getUser().getSocket().send(JSON.stringify(data))
    }

	syncClientsGameEnded(winner: PongPlayer, looser: PongPlayer) {
        this.opponent1.getUser().setInGame(false)
        this.opponent2.getUser().setInGame(false)

		this.opponent1.getUser().getSocket().send(JSON.stringify({
            event: "game_end",
            data: {
                isWinner: winner.getUser().getId() === this.opponent1.getUser().getId()
            }
        }));
		this.opponent2.getUser().getSocket().send(JSON.stringify({
            event: "game_end",
            data: {
                isWinner: winner.getUser().getId() === this.opponent2.getUser().getId()
            }
        }));
    }

}
