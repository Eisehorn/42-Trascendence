import {PongPosition} from "./pong-position";
import {PongPlayer} from "./pong-player";
import {PongMatch} from "./pong-match";
import {PongPower} from "./pong-power";

export class PongBall {

    public static BALL_RADIUS = 15;
    public ball_speed = 5;

    private pos: PongPosition = new PongPosition(PongMatch.SCREEN_WIDTH / 2, PongMatch.SCREEN_HEIGHT / 2);
    private dir: PongPosition = new PongPosition(5, 5);
    private lastScorer = 0;
	private lastHitter = 0;

    setDir() {
		this.pos.x = PongMatch.SCREEN_WIDTH / 2;
		this.pos.y = PongMatch.SCREEN_HEIGHT / 2;
        if (this.lastScorer <= 0) {
            this.dir = new PongPosition(this.ball_speed, Math.round(Math.random() * this.ball_speed) * (Math.random() < 0.5 ? 1 : -1))
        }

        if (this.lastScorer > 0) {
            this.dir = new PongPosition(this.ball_speed * -1, Math.round(Math.random() * this.ball_speed) * (Math.random() < 0.5 ? 1 : -1))
        }
    }

    tick(pongMatch: PongMatch) {
        this.pos.add(this.dir)
        if (this.isColliding(pongMatch.getOpponent1())) {
            this.collidePosition(pongMatch.getOpponent1())
			this.ball_speed *= 1.05;
        }

        if (this.isColliding(pongMatch.getOpponent2())) {
            this.collidePosition(pongMatch.getOpponent2())
			this.ball_speed *= 1.05;
		}

        if (this.isCollidingWall()) {
            this.collideWall();
        }

        if (!this.isColliding(pongMatch.getOpponent1()) && this.pos.x - PongBall.BALL_RADIUS <= 0) {
            this.lastScorer = 1;
            this.pointScored(pongMatch.getOpponent2());
			pongMatch.getOpponent1().player_height = 130;
			pongMatch.getOpponent2().player_height = 130;
        }

        if (!this.isColliding(pongMatch.getOpponent2()) && this.pos.x + PongBall.BALL_RADIUS >= PongMatch.SCREEN_WIDTH) {
            this.lastScorer = 0;
            this.pointScored(pongMatch.getOpponent1());
			pongMatch.getOpponent1().player_height = 130;
			pongMatch.getOpponent2().player_height = 130;
        }

        if (pongMatch.getOpponent1().getScore() >= PongMatch.MAX_SCORE || !pongMatch.getOpponent2().getUser().isActive()) {
			pongMatch.setMatchEnded(1);
        }

        if (pongMatch.getOpponent2().getScore() >= PongMatch.MAX_SCORE || !pongMatch.getOpponent1().getUser().isActive()) {
			pongMatch.setMatchEnded(2);
        }

        if (!pongMatch.getIsPowerActive() && pongMatch.getNeon() && Math.random() >= 0.85) {
            pongMatch.setPower();
        }

        if (pongMatch.getNeon() && pongMatch.getIsPowerActive() && this.collidePower(pongMatch.getPower())) {
			pongMatch.activatePower(this.lastHitter == 0 ? pongMatch.getOpponent1() : pongMatch.getOpponent2())
        }
    }

    pointScored(player: PongPlayer) {
        player.addScore();
        this.setDir();
    }

    collidePower(power: PongPower){
        const distance_x = Math.abs(this.pos.x - power.x);
        const distance_y = Math.abs(this.pos.y - power.y);

        if (distance_x > (PongBall.BALL_RADIUS + PongPower.POWER_WIDTH/2)) {
            return false;
        }

        if (distance_y > (PongBall.BALL_RADIUS + PongPower.POWER_HEIGHT/2)) {
            return false;
        }

        if (distance_x <= (PongBall.BALL_RADIUS + PongPower.POWER_WIDTH/2)) {
            return true;
        }

        if (distance_x <= (PongBall.BALL_RADIUS + PongPower.POWER_HEIGHT/2)) {
            return true;
        }
    }

    collidePosition(player: PongPlayer) {
        let collidePoint = (this.pos.y - (player.getPos().y + player.player_height/2))
        collidePoint = collidePoint/(player.player_height/2)
        const angleRad = (Math.PI/4) * collidePoint
        const direction = (this.pos.x + PongBall.BALL_RADIUS < PongMatch.SCREEN_WIDTH/2) ? 1 : -1
        this.dir.x = direction * this.ball_speed * Math.cos(angleRad)
        this.dir.y = this.ball_speed * Math.sin(angleRad)
    }

    collideWall() {
        this.dir.y *= -1;
    }

    getPos(): PongPosition {
        return this.pos;
    }

    getDir(): PongPosition {
        return this.dir;
    }

    isCollidingWall() {
        if (this.pos.y - PongBall.BALL_RADIUS <= 0 || this.pos.y + PongBall.BALL_RADIUS >= PongMatch.SCREEN_HEIGHT) {
            return true;
        }

        return false;
    }

    isColliding(player: PongPlayer) {
        const distance_x = Math.abs(this.pos.x - player.getPos().x)
        const distance_y = Math.abs(this.pos.y - player.getPos().y)

        if (distance_x > (PongPlayer.PLAYER_WIDTH/2 + PongBall.BALL_RADIUS)) {
            return false;
        }

        if (distance_y > (player.player_height/2 + PongBall.BALL_RADIUS)) {
            return false;
        }

        if (distance_x <= (PongPlayer.PLAYER_WIDTH/2 + PongBall.BALL_RADIUS)) {
			if (this.pos.x < 960)
				this.lastHitter = 0;
			else if (this.pos.x >= 960)
				this.lastHitter = 1;
            return true;
        }

        if (distance_y <= (player.player_height/2 + PongBall.BALL_RADIUS)) {
			if (this.pos.x < 960)
				this.lastHitter = 0;
			else if (this.pos.x >= 960)
				this.lastHitter = 1;
			return true;
        }

        const corner_sq = (distance_x - PongPlayer.PLAYER_WIDTH/2)^2 + (distance_y - player.player_height/2)^2

        return (corner_sq <= ((PongBall.BALL_RADIUS)^2))
    }

}
