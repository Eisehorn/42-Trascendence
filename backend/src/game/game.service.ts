import {Injectable, OnModuleInit} from '@nestjs/common';
import {GameUser} from "./objs/game-user";
import {Cron, CronExpression} from "@nestjs/schedule";
import {AuthedWebSocket} from "../auth/auth.gateway";
import {PongMatch} from "./objs/pong-match";
import {PrismaService} from "../prisma/prisma.service";
import {PongPlayer} from "./objs/pong-player";

@Injectable()
export class GameService implements OnModuleInit {

    gameUsers: Map<string, GameUser> = new Map<string, GameUser>();
    matches: PongMatch[] = [];

	constructor(private prismaService: PrismaService) {
	}

	getMatches() {
		return this.matches;
	}

	async getLeaderboard() {
        return (await this.prismaService.user.findMany({
			orderBy: {
				points: "desc",
			},
        })).map(user => {
			return {
				id: user.id,
				username: user.username,
				avatar: user.avatar,
				points: user.points
			}
		})
    }
    onModuleInit() {
        this.handleGameTick()
    }

    updateGameUser(socket: AuthedWebSocket) {
        if (!socket.user) {
            return;
        }
        if (!socket.user.id) {
            return;
        }

        let user = this.gameUsers.get(socket.user.id);
        if (!user) {
            this.gameUsers.set(socket.user.id, new GameUser(socket));
        } else {
            user.updateUser();
        }
    }

    removeGameUser(id: string) {
        const gameUser = this.gameUsers.get(id);
        if (gameUser) {
            gameUser.setLastUpdate(0);
        }
        this.gameUsers.delete(id);
    }

    getGameUser(id: string) {
        return this.gameUsers.get(id);
    }

	async closeGame(winner: PongPlayer, looser: PongPlayer) {
		await this.prismaService.user.update({
			where: {
				id: winner.getUser().getId()
			},
			data: {
				points: {
					increment: 1
				}
			}
		})

		await this.prismaService.match.create({
			data: {
				winnerId: winner.getUser().getId(),
				looserId: looser.getUser().getId()
			}
		})
	}

    handleGameTick() {

        for (let match of this.matches) {
            match.tick();
			if (match.getMatchEnded() != 0) {
				this.closeGame(match.getMatchEnded() == 1 ? match.getOpponent1() : match.getOpponent2(),  match.getMatchEnded() == 1 ? match.getOpponent2() : match.getOpponent1());
				match.syncClientsGameEnded(match.getMatchEnded() == 1 ? match.getOpponent1() : match.getOpponent2(),  match.getMatchEnded() == 1 ? match.getOpponent2() : match.getOpponent1())
			}
        }
		this.matches = this.matches.filter(match => match.getMatchEnded() === 0)
        setTimeout(() => this.handleGameTick(), 10);
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    handleMatchmaking() {
        const lookingUsers = [...this.gameUsers.values()].filter(user => user.isLookingForOpponent() && user.isActive())
        if (lookingUsers.length < 2) {
            return;
        }

        while (lookingUsers.length >= 2) {
            let gameUser1 = lookingUsers.pop();
            let gameUser2 = lookingUsers.pop();
            if (!gameUser1 || !gameUser2) {
                continue;
            }

            gameUser1.setLookingForOpponent(false);
            gameUser2.setLookingForOpponent(false);
            gameUser1.setInGame(true);
            gameUser2.setInGame(true);

			const pongMatch = new PongMatch(gameUser1, gameUser2);
			pongMatch.start();
			this.matches.push(pongMatch);
        }
    }
    @Cron(CronExpression.EVERY_5_SECONDS)
    handleMatchmakingNeon() {
        const lookingUsersNeon = [...this.gameUsers.values()].filter(user => user.isLookingForOpponentNeon() && user.isActive())
        if (lookingUsersNeon.length < 2) {
            return;
        }

        while (lookingUsersNeon.length >= 2) {
            let gameUser1 = lookingUsersNeon.pop();
            let gameUser2 = lookingUsersNeon.pop();
            if (!gameUser1 || !gameUser2) {
                continue;
            }

            gameUser1.setLookingForOpponentNeon(false);
            gameUser2.setLookingForOpponentNeon(false);
            gameUser1.setInGame(true);
            gameUser2.setInGame(true);
			const pongMatch = new PongMatch(gameUser1, gameUser2);
			pongMatch.start_neon();
			this.matches.push(pongMatch);
        }
    }

	async getMatchHistory(id: string) {
		return this.prismaService.match.findMany({
			where: {
				OR: [
					{
						winnerId: id
					},
					{
						looserId: id
					}
				]
			},
            include: {
                winner: {
                    select: {
                        id: true,
                        avatar: true,
                        username: true
                    }
                },
                looser: {
                    select: {
                        id: true,
                        avatar: true,
                        username: true
                    }
                }
            }
		})
	}
}
