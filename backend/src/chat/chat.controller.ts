import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Post, Query,
    Req,
    UseGuards
} from '@nestjs/common';
import {AuthedRequest, AuthGuard} from '../auth/auth.guard';
import {ChatService} from './chat.service';

@Controller('chat')
export class ChatController {

    constructor(private chatService: ChatService) {
    }

    @UseGuards(AuthGuard)
    @Get('channel')
    @HttpCode(HttpStatus.OK)
    async listChannels() {
        return await this.chatService.listChannels();
    }

    @UseGuards(AuthGuard)
    @Get('channelMembers')
    @HttpCode(HttpStatus.OK)
    async channelMembers(@Req() request: AuthedRequest, @Query('channelId') channelId: string) {
        if (!channelId) {
            throw new BadRequestException("invalid channel id");
        }

        return this.chatService.getChannelMembers(request.user, channelId);
    }

    @UseGuards(AuthGuard)
    @Post('channel')
    @HttpCode(HttpStatus.OK)
    async createChannel(@Req() request: AuthedRequest, @Body('name') name: string, @Body('password') password: string | undefined, @Body('isPrivate') isPrivate: boolean) {
        if (!name) {
            throw new BadRequestException("invalid channel id");
        }

        await this.chatService.createChannel(request.user, name, isPrivate, password);
        return {message: 'Channel created', statusCode: 200};
    }

    @UseGuards(AuthGuard)
    @Post('directChannel')
    @HttpCode(HttpStatus.OK)
    async createDirectChannel(@Req() request: AuthedRequest, @Body('userId') userId: string) {
        if (!userId) {
            throw new BadRequestException("invalid channel id");
        }

        return this.chatService.createDirectChannel(request.user, userId);
    }

    @UseGuards(AuthGuard)
    @Get('joinedChannels')
    @HttpCode(HttpStatus.OK)
    async joinedChannels(@Req() request: AuthedRequest) {
        return await this.chatService.listJoinedChannels(request.user);
    }

    @UseGuards(AuthGuard)
    @Post('joinChannel')
    @HttpCode(HttpStatus.OK)
    async joinChannel(@Req() request: AuthedRequest, @Body('channelId') channelId: string, @Body('password') password: string | undefined) {
        if (!channelId) {
            throw new BadRequestException("invalid channel id");
        }

        await this.chatService.joinChannel(request.user, channelId, password);
        return {message: 'Joined channel', statusCode: 200};
    }

    @UseGuards(AuthGuard)
    @Post('leaveChannel')
    @HttpCode(HttpStatus.OK)
    async leaveChannel(@Req() request: AuthedRequest, @Body('channelId') channelId: string) {
        if (!channelId) {
            throw new BadRequestException("invalid channel id");
        }

        await this.chatService.leaveChannel(request.user, channelId);
        return {message: 'Channel left', statusCode: 200};
    }

    @UseGuards(AuthGuard)
    @Post('admin')
    @HttpCode(HttpStatus.OK)
    async addAdmin(@Req() request: AuthedRequest, @Body('channelId') channelId: string, @Body('userId') userId: string) {
        if (!userId) {
            throw new BadRequestException("invalid channel id")
        }

        await this.chatService.addChannelAdmin(request.user, channelId, userId);
        return {message: 'Admin added', statusCode: 200};
    }

    @UseGuards(AuthGuard)
    @Post('kickUser')
    @HttpCode(HttpStatus.OK)
    async kickUser(@Req() request: AuthedRequest, @Body('channelId') channelId: string, @Body('userId') userId: string) {
        if (!userId) {
            throw new BadRequestException("invalid channel id")
        }

        await this.chatService.kickUserFromChannel(request.user, channelId, userId);
        return {message: 'User kicked', statusCode: 200};
    }

    @UseGuards(AuthGuard)
    @Post('banUser')
    @HttpCode(HttpStatus.OK)
    async banUser(@Req() request: AuthedRequest, @Body('channelId') channelId: string, @Body('userId') userId: string) {
        if (!userId) {
            throw new BadRequestException("invalid channel id")
        }

        await this.chatService.banUserFromChannel(request.user, channelId, userId);
        return {message: 'User banned', statusCode: 200};
    }

    @UseGuards(AuthGuard)
    @Post('muteUser')
    @HttpCode(HttpStatus.OK)
    async muteUser(@Req() request: AuthedRequest, @Body('channelId') channelId: string, @Body('userId') userId: string, @Body('until') until: Date) {
        if (!userId) {
            throw new BadRequestException("invalid channel id")
        }

        await this.chatService.muteUserInChannel(request.user, channelId, userId, until);
        return {message: 'User muted', statusCode: 200};
    }

    @UseGuards(AuthGuard)
    @Delete('admin')
    @HttpCode(HttpStatus.OK)
    async deleteAdmin(@Req() request: AuthedRequest, @Body('channelId') channelId: string, @Body('userId') userId: string) {
        if (!userId) {
            throw new BadRequestException("invalid channel id")
        }

        await this.chatService.removeChannelAdmin(request.user, channelId, userId);
        return {message: 'Admin removed', statusCode: 200};
    }

    @UseGuards(AuthGuard)
    @Post('changePassword')
    @HttpCode(HttpStatus.OK)
    async changePassword(@Req() request: AuthedRequest, @Body('channelId') channelId: string, @Body('password') password: string | undefined) {
        if (!channelId) {
            throw new BadRequestException("invalid channel id");
        }

        await this.chatService.changeChannelPassword(request.user, channelId, password);
        return {message: 'Password changed', statusCode: 200};
    }

    @UseGuards(AuthGuard)
    @Get('channelHistory')
    @HttpCode(HttpStatus.OK)
    async channelHistory(@Req() request: AuthedRequest, @Query('channelId') channelId: string) {
        if (!channelId) {
            throw new BadRequestException("invalid channel id");
        }

        return this.chatService.channelHistory(request.user, channelId);
    }

    @UseGuards(AuthGuard)
    @Post('game_invite')
    @HttpCode(HttpStatus.OK)
    async gameResponse(@Req() request: AuthedRequest, @Body('userId') userId: string) {

        if (!userId) {
            throw new BadRequestException('User not existing');
        }
        await this.chatService.gameAccept(userId, request.user)
        return {message: 'Match Accepted'}
    }
}
