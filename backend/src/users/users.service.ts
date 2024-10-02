import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {User} from '@prisma/client';
import {UpdateUserDTO} from './dto/update_user.dto';
import {Secret, TOTP, URI} from 'otpauth';
import {GameService} from "../game/game.service";

@Injectable()
export class UsersService {

    constructor(private prismaService: PrismaService, private gameService: GameService) {
    }

    async createUserIf42IdNotExists(accessToken: string): Promise<any> {
        const userRes = await fetch('https://api.intra.42.fr/v2/me', {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        const userData = await userRes.json();
        const user = await this.prismaService.user.findFirst({
            where: {
                ft_id: userData['id'],
            },
        }) as any;
        if (user) {
            user.just_created = false
            return user;
        }
        const createdUser = await this.prismaService.user.create({
            data: {
                username: userData['login'],
                avatar: userData['image']['link'],
                ft_id: userData['id'],
            },
        }) as any;

        createdUser.just_created = true
        return createdUser;
    }

    async createUserIfGoogleIdNotExists(accessToken: string): Promise<any> {
        const userRes = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        const userData = await userRes.json();

        const user = await this.prismaService.user.findFirst({
            where: {
                google_id: userData['id'],
            },
        });
        if (user) {
            return {just_created: false, ...user};
        }

        const createdUser = this.prismaService.user.create({
            data: {
                username: userData['name'],
                avatar: userData['picture'],
                google_id: userData['id'],
            },
        });

        return {just_created: true, ...createdUser};
    }

    async updateUser(user: User, dto: UpdateUserDTO) {
        const updatePayload: any = {};
        if (dto.avatar) {
            updatePayload['avatar'] = dto.avatar;
        }
        if (dto.username) {
            updatePayload['username'] = dto.username;
        }

        if (user.username != dto.username && dto.username && dto.username.length != 0) {
            const tempUser = await this.prismaService.user.findFirst({
                where: {
                    username: dto.username
                }
            })
            if (tempUser) {
                throw new BadRequestException("There is already another user with this name");
            }
        }

        try {
            return this.prismaService.user.update({
                where: {
                    id: dto.id,
                },
                data: updatePayload,
            });
        } catch (e) {
            throw new InternalServerErrorException('User Update not succesfull!');
        }
    }

    async getUser(id: string) {
        return this.prismaService.user.findFirst({
            where: {
                id: id,
            },
        });
    }

    async validate2FA(user: User, code: string) {
        if (!user.two_factor_secret) {
            throw new BadRequestException('2FA Secret not found.');
        }

        const totp = URI.parse(user.two_factor_secret);
        if (totp.validate({token: code, window: 1}) === null) {
            throw new UnauthorizedException('Invalid 2FA token.');
        }

        try {
            await this.prismaService.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    two_factor_enabled: true,
                },
            });
        } catch (e) {
            throw new InternalServerErrorException('User update not successfull');
        }
    }

    async disable2FA(user: User) {
        if (!user.two_factor_secret || !user.two_factor_enabled) {
            throw new BadRequestException('2FA not enabled');
        }

        try {
            await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: {
                    two_factor_enabled: false,
                    two_factor_secret: null
                }
            })
        } catch (e) {
            throw new InternalServerErrorException('User Update not successfull!');
        }
    }

    async generate2FASecret(user: User) {
        if (user.two_factor_secret) {
            return URI.parse(user.two_factor_secret);
        }

        const secret = new Secret();
        let totp = new TOTP({
            issuer: 'Transcendence',
            label: user.username,
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: secret,
        });

        try {
            await this.prismaService.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    two_factor_secret: totp.toString(),
                },
            });
        } catch (e) {
            throw new InternalServerErrorException('User Update not successfull!');
        }
        return totp;
    }

    async sendFriendRequest(sender: User, targetId: string) {
        const target = await this.getUser(targetId);
        if (!target) {
            throw new NotFoundException('User Id not found!');
        }

        if (target.friends.includes(sender.id)) {
            throw new BadRequestException("You're already friend.");
        }

        const request = await this.prismaService.friendRequest.findFirst({
            where: {
                senderId: sender.id,
                targetId: targetId
            }
        })
        if (request) {
            throw new BadRequestException("Request already sent.");
        }

        return this.prismaService.friendRequest.create({
            data: {
                senderId: sender.id,
                targetId: targetId
            }
        })
    }

    async getFriendRequests(user: User) {
        return this.prismaService.friendRequest.findMany({
            where: {
                targetId: user.id
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        })
    }

    async removeFriendRequest(user: User, requestId: string) {
        const request = await this.prismaService.friendRequest.findFirst({
            where: {
                id: requestId,
                targetId: user.id
            }
        })
        if (!request) {
            throw new NotFoundException('User Id not found!');
        }

        await this.prismaService.friendRequest.delete({
            where: {
                id: requestId
            }
        })
    }

    async acceptFriendRequest(user: User, requestId: string) {
        const request = await this.prismaService.friendRequest.findFirst({
            where: {
                id: requestId,
                targetId: user.id
            }
        })
        if (!request) {
            throw new NotFoundException('User Id not found!');
        }

        const sender = await this.getUser(request.senderId);
        if (!sender) {
            throw new InternalServerErrorException('Sender Id not found!');
        }

        if (sender.id === user.id) {
            throw new BadRequestException('You are befriending yourself you fool!')
        }

        await this.prismaService.user.update({
            where: {
                id: sender.id
            },
            data: {
                friends: {
                    push: user.id
                }
            }
        })
        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                friends: {
                    push: sender.id
                }
            }
        })
        await this.prismaService.friendRequest.delete({
            where: {
                id: requestId
            }
        })
    }

    async getFriends(userId: string) {
        const user = await this.getUser(userId)
        if (!user) {
            throw new NotFoundException('User Id not found!');
        }
        let friends: { id: string, status: string }[] = [];

        for (let friendId of user.friends) {
            const gameUser = this.gameService.getGameUser(friendId);
            let status = "offline";
            if (gameUser) {
                if (gameUser.isInGame()) {
                    status = "in_game";
                } else if (gameUser.isActive()) {
                    status = "online";
                }
            }

            friends.push({
                id: friendId,
                status: status
            })
        }

        return friends;
    }

    async unblockUser(user: User, toUnblockId: string) {
        if (user.blockedUsers.includes(toUnblockId)) {
            throw new BadRequestException("User not blocked.");
        }

        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                blockedUsers: {
                    set: user.blockedUsers.filter(s => s !== toUnblockId),
                }
            }
        })
    }

    async blockUser(user: User, toBlockId: string) {
        if (user.blockedUsers.includes(toBlockId)) {
            throw new BadRequestException("User already blocked.");
        }

        const toBlock = await this.getUser(toBlockId);
        if (!toBlock) {
            throw new NotFoundException("User not found.");
        }

        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                blockedUsers: {
                    push: toBlockId
                }
            }
        })
    }

}
