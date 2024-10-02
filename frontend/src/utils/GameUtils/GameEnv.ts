import { Ball } from "./Ball";
import { Player } from "./Player";


export class Game {

	W:				number;
	H:				number;
	time:			number;
	

	player_1:		Player;
	player_2:		Player;
	ball:			Ball;


	constructor(W: number, H: number, time: number, player_1: Player, player_2: Player) {
		this.W = W;
		this.H = H;
		this.time = time;

		this.player_1 = player_1;
		this.player_2 = player_2;

		this.ball = new Ball(W / 2, H / 2, 0, 0, 20);
		
	}
}