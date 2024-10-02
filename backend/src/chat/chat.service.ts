import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {ChatChannel, User} from '@prisma/client';
import 'bcrypt';
import {compare, hash} from 'bcrypt';
import {AuthedWebSocket} from "../auth/auth.gateway";
import {GameService} from "../game/game.service";
import {PongMatch} from "../game/objs/pong-match";

@Injectable()
export class ChatService {

	connectedUsers: Map<string, AuthedWebSocket> = new Map<string, AuthedWebSocket>();

	constructor(private prismaService: PrismaService, private gameService: GameService) {
	}

	addConnectedUser(socket: AuthedWebSocket) {
		this.connectedUsers.set(socket.user.id, socket)
	}

	removeConnectedUser(socket: AuthedWebSocket) {
		this.connectedUsers.delete(socket.user.id);
	}

	async listChannels() {
		const channels = await this.prismaService.chatChannel.findMany({
			select: {
				id: true,
				name: true,
				password: true,
			},
			where: {
				isPrivate: false,
				isDirectChat: false
			}
		});

		return channels.map(channel => {
			return {
				id: channel.id,
				name: channel.name,
				password: !!channel.password,
			};
		});
	}

	async createChannel(user: User, name: string, isPrivate: boolean, password: string | undefined) {
		password = password ? await hash(password, 10) : undefined;

		await this.prismaService.chatChannel.create({
			data: {
				name: name,
				owner: user.id,
				password: password,
				isPrivate: isPrivate,
				isDirectChat: false,
				admins: [user.id],
				members: [user.id],
			},
		});
	}

	async createDirectChannel(user: User, otherUserId: string) {
		const otherUser = await this.prismaService.user.findFirst({
			where: {
				id: otherUserId
			}
		})
		if (!otherUser) {
			throw new NotFoundException("user not found");
		}

		const channelName = user.id + "~" + otherUser.id;
		if ((await this.getChannelByName(channelName)) || (await this.getChannelByName(otherUser.id + "~" + user.id))) {
			throw new BadRequestException("channel already existing");
		}

		return this.prismaService.chatChannel.create({
			data: {
				name: channelName,
				owner: user.id,
				isPrivate: true,
				isDirectChat: true,
				admins: [user.id, otherUserId],
				members: [user.id, otherUserId]
			}
		})
	}

	async getChannelMembers(user: User, id: string) {
		const channel = await this.getChannel(id);
		if (!channel) {
			throw new NotFoundException("channel not found");
		}

		if (!channel.members.includes(user.id)) {
			throw new UnauthorizedException("you're not in the channel");
		}

		return {members: channel.members, admins: channel.admins, owner: channel.owner};
	}

	async getChannel(id: string) {
		return this.prismaService.chatChannel.findFirst({
			where: {
				id: id
			}
		});
	}

	async getChannelByName(name: string) {
		return this.prismaService.chatChannel.findFirst({
			where: {
				name: name
			}
		});
	}

	async sendMessage(channel: ChatChannel, user: User, message: string) {
		if (!(channel.members.includes(user.id))) {
			return;
		}

		const chatMessage = await this.prismaService.chatMessage.create({
			include: {
				sender: {
					select: {
						id: true,
						username: true,
						avatar: true
					}
				}
			},
			data: {
				sender: {
					connect: {
						id: user.id
					}
				},
				message: message,
				channel: {
					connect: {
						id: channel.id
					}
				}
			}
		});

		if (!chatMessage) {
			return
		}

		for (let member of channel.members) {
			const socket = this.connectedUsers.get(member);
			if (socket) {
				if (socket.user.blockedUsers.includes(user.id)) {
					continue;
				}

				socket.send(JSON.stringify({
					event: "chat_msg_receive",
					data: chatMessage
				}))
			}
		}
	}

	async listJoinedChannels(user: User) {
		const channels = await this.prismaService.chatChannel.findMany({
			select: {
				id: true,
				name: true,
				password: true,
				members: true,
				admins: true,
				isDirectChat: true
			},
			where: {
				members: {
					has: user.id,
				},
			},
		});

		return channels.map(channel => {
			return {
				id: channel.id,
				name: channel.name,
				password: !!channel.password,
				isDirectChat: channel.isDirectChat,
				admins: channel.admins,
				members: channel.members
			};
		});
	}

	async removeChannelAdmin(user: User, channelId: string, toRemoveId: string) {
		const channel = await this.prismaService.chatChannel.findFirst({
			where: {
				id: channelId
			}
		})
		if (!channel) {
			throw new NotFoundException("channel not found");
		}
		if (channel.isDirectChat) {
			throw new UnauthorizedException("you can't remove an admin in a direct chat");
		}
		if (channel.owner != user.id) {
			throw new UnauthorizedException("you're not the owner of the channel");
		}
		if (!channel.admins.includes(toRemoveId)) {
			throw new NotFoundException("admin not found");
		}

		await this.prismaService.chatChannel.update({
			data: {
				admins: {
					set: channel.admins.filter(s => s !== toRemoveId),
				},
			},
			where: {
				id: channel.id,
			},
		});
	}

	async addChannelAdmin(user: User, channelId: string, newAdminId: string) {
		const channel = await this.prismaService.chatChannel.findFirst({
			where: {
				id: channelId
			}
		})
		if (!channel) {
			throw new NotFoundException("channel not found");
		}
		if (channel.isDirectChat) {
			throw new UnauthorizedException("you can't add an admin in direct chat");
		}
		if (channel.owner != user.id) {
			throw new UnauthorizedException("you're not the channel owner");
		}

		const newAdmin = await this.prismaService.user.findFirst({
			where: {
				id: newAdminId
			}
		})
		if (!newAdmin) {
			throw new NotFoundException("new admin not found");
		}

		if (!(channel.members.includes(newAdminId)) || channel.admins.includes(newAdminId)) {
			throw new BadRequestException("admin not in channel");
		}

		await this.prismaService.chatChannel.update({
			where: {
				id: channel.id
			},
			data: {
				admins: {
					push: newAdmin.id
				}
			}
		})
	}

	async changeChannelPassword(user: User, channelId: string, password: string | undefined) {
		const channel = await this.prismaService.chatChannel.findFirst({
			where: {
				id: channelId,
			},
		});
		if (!channel) {
			throw new NotFoundException("channel not found");
		}
		if (channel.isDirectChat) {
			throw new UnauthorizedException("you can't do that in a direct chat");
		}
		if (user.id != channel.owner) {
			throw new UnauthorizedException("you're not an owner");
		}

		await this.prismaService.chatChannel.update({
			where: {
				id: channelId
			},
			data: {
				password: password
			}
		})
	}

	async banUserFromChannel(user: User, channelId: string, toBanId: string) {
		const channel = await this.prismaService.chatChannel.findFirst({
			where: {
				id: channelId,
			},
		});
		if (!channel) {
			throw new NotFoundException("channel not found");
		}
		if (channel.isDirectChat) {
			throw new UnauthorizedException("you can't do that in a direct chat");
		}
		if (!(channel.admins.includes(user.id))) {
			throw new UnauthorizedException("you're not an admin");
		}
		if (channel.admins.includes(toBanId)) {
			throw new UnauthorizedException("you can't ban an admin");
		}
		if (!(channel.members.includes(toBanId))) {
			throw new BadRequestException("you can't ban someone that's not in the channel");
		}
		if (channel.bannedUsers.includes(toBanId)) {
			throw new BadRequestException("this user is already banned");
		}

		await this.prismaService.chatChannel.update({
			data: {
				members: {
					set: channel.members.filter(s => s !== toBanId),
				},
				bannedUsers: {
					push: toBanId
				}
			},
			where: {
				id: channel.id,
			},
		});
	}

	async muteUserInChannel(user: User, channelId: string, toMuteId: string, until: Date) {
		const channel = await this.prismaService.chatChannel.findFirst({
			where: {
				id: channelId,
			},
		});
		if (!channel) {
			throw new NotFoundException("channel not found");
		}
		if (channel.isDirectChat) {
			throw new UnauthorizedException("you can't do that in a direct chat");
		}
		if (!(channel.admins.includes(user.id))) {
			throw new UnauthorizedException("you're not an admin");
		}
		if (channel.admins.includes(toMuteId)) {
			throw new UnauthorizedException("you can't mute an admin");
		}
		if (!(channel.members.includes(toMuteId))) {
			throw new BadRequestException("you can't mute someone that's not in the channel");
		}

		await this.prismaService.chatMute.create({
			data: {
				channelId: channelId,
				userId: toMuteId,
				until: until
			}
		});
	}

	async kickUserFromChannel(user: User, channelId: string, toKickId: string) {
		const channel = await this.prismaService.chatChannel.findFirst({
			where: {
				id: channelId,
			},
		});
		if (!channel) {
			throw new NotFoundException("channel not found");
		}
		if (channel.isDirectChat) {
			throw new UnauthorizedException("you can't do that in a direct chat");
		}
		if (!(channel.admins.includes(user.id))) {
			throw new UnauthorizedException("you're not an admin");
		}
		if (channel.admins.includes(toKickId)) {
			throw new UnauthorizedException("you can't kick another admin");
		}
		if (!(channel.members.includes(toKickId))) {
			throw new BadRequestException("you can't kick someone that's not in this channel");
		}

		await this.prismaService.chatChannel.update({
			data: {
				members: {
					set: channel.members.filter(s => s !== toKickId),
				},
			},
			where: {
				id: channel.id,
			},
		});
	}

	async joinChannel(user: User, channelId: string, password: string | undefined) {
		const channel = await this.prismaService.chatChannel.findFirst({
			where: {
				id: channelId,
			},
		});

		if (!channel || channel.isPrivate || channel.isDirectChat) {
			throw new NotFoundException("channel not found");
		}
		if (channel.members.includes(user.id)) {
			throw new BadRequestException('You\'re already in this channel');
		}
		if (channel.bannedUsers.includes(user.id)) {
			throw new UnauthorizedException("You've been banned from this channel")
		}
		if ((channel.password && !password) || (channel.password && password && !(await compare(password, channel.password)))) {
			throw new UnauthorizedException();
		}

		await this.prismaService.chatChannel.update({
			data: {
				members: {
					push: user.id,
				},
			},
			where: {
				id: channel.id,
			},
		});
	}

	async leaveChannel(user: User, channelId: string) {
		const channel = await this.prismaService.chatChannel.findFirst({
			where: {
				id: channelId,
			},
		});

		if (!channel) {
			throw new NotFoundException("channel not found");
		}
		if (channel.isDirectChat) {
			throw new UnauthorizedException("you can't leave a direct chat");
		}
		if (channel.members.indexOf(user.id) == -1) {
			throw new BadRequestException('You\'re not in the channel you\'re trying to leave');
		}

		await this.prismaService.chatChannel.update({
			data: {
				members: {
					set: channel.members.filter(s => s !== user.id),
				},
			},
			where: {
				id: channel.id,
			},
		});
	}

	async isMutedInChannel(user: User, channelId: string) {
		const mute = await this.prismaService.chatMute.findFirst({
			where: {
				channelId: channelId,
				userId: user.id,
				until: {
					gte: new Date(Date.now())
				}
			}
		})

		return !!mute;
	}

	async channelHistory(user: User, channelId: string) {
		const channel = await this.prismaService.chatChannel.findFirst({
			where: {
				id: channelId,
			},
		});

		if (!channel) {
			throw new NotFoundException("channel not found");
		}

		if (!(channel.members.includes(user.id))) {
			throw new UnauthorizedException("you're not in this channel");
		}

		const messages = await this.prismaService.chatMessage.findMany({
			include: {
				sender: {
					select: {
						id: true,
						username: true,
						avatar: true
					}
				}
			},
			where: {
				channelId: channelId
			}
		});

		return messages.filter(msg => !(user.blockedUsers.includes(msg.sender.id)));
	}

	async gameAccept(userId: string, user: User) {

		const senderUser = this.gameService.getGameUser(user.id)
		const receiverUser = this.gameService.getGameUser(userId)

		if (!senderUser || !receiverUser || !senderUser.isActive() || !receiverUser.isActive() ){
			throw new BadRequestException('User not online')
		}
		if (senderUser.isInGame() || receiverUser.isInGame()) {
			throw new BadRequestException('User is in game')
		}
		senderUser.setLookingForOpponent(false)
		senderUser.setLookingForOpponentNeon(false)
		receiverUser.setLookingForOpponent(false)
		receiverUser.setLookingForOpponentNeon(false)
		senderUser.setInGame(true);
		receiverUser.setInGame(true);

		const pongMatch = new PongMatch(senderUser, receiverUser);
		pongMatch.start();
		this.gameService.getMatches().push(pongMatch)
	}
}
