import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus, Injectable, Query,
	Req,
	UseGuards,
} from '@nestjs/common';
//import {GameUser} from './objs/game-user';
import {AuthedRequest, AuthGuard} from "../auth/auth.guard";
import {GameService} from "./game.service";

@Controller('game')
@Injectable()
export class GameController {
	constructor(private gameService: GameService) {
	}

	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	@Get('matchmaking/classic')
	async find_Matchmaking(@Req() request: AuthedRequest) {
		const gameUser = this.gameService.getGameUser(request.user.id)
		if (!gameUser) {
			throw new BadRequestException('Game User ID not found')
		}

		gameUser.setLookingForOpponent(true)
		return {message: "Started matchmaking on classic mode", statusCode: 200}
	}

	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	@Get('matchmaking/neon')
	async find_Matchmaking_Neon(@Req() request: AuthedRequest) {
		const gameUser = this.gameService.getGameUser(request.user.id)
		if (!gameUser) {
			throw new BadRequestException('Game User ID not found')
		}

		gameUser.setLookingForOpponentNeon(true)
		return {message: "Started matchmaking on neon mode", statusCode: 200}
	}

	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	@Get('matchmaking/exit')
	async exitMatchMaking(@Req() request: AuthedRequest) {
		const gameUser = this.gameService.getGameUser(request.user.id)
		if (!gameUser) {
			throw new BadRequestException('User not found')
		}

		gameUser.setLookingForOpponent(false)
		gameUser.setLookingForOpponentNeon(false)
	}

	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	@Get('/leaderboard')
	async leaderBoard() {
		return this.gameService.getLeaderboard()
	}

	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	@Get('/match_history')
	async matchHistory(@Req() request: AuthedRequest, @Query('userId') userId: string) {
		return this.gameService.getMatchHistory(userId);
	}

}
