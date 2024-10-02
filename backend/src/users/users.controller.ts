import {
    BadRequestException,
    Body,
    Controller, Delete,
    Get,
    Header,
    HttpCode,
    HttpStatus, NotFoundException,
    ParseFilePipeBuilder,
    Post, Query,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {AuthedRequest, AuthGuard} from '../auth/auth.guard';
import {FileInterceptor} from '@nestjs/platform-express';
import {UsersService} from './users.service';
import {toFileStream} from 'qrcode';
import {Response} from 'express';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {
    }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    me(@Req() request: AuthedRequest) {
        const user = request.user;
        return {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            friends: user.friends,
            two_factor_enabled: user.two_factor_enabled,
        };
    }

    @Get('user')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async user(@Req() request: AuthedRequest, @Query("userId") userId: string) {
        if (!userId) {
            throw new BadRequestException('User Id not found!');
        }

        const user = await this.userService.getUser(userId);
        if (!user) {
            throw new NotFoundException('User not Found!');
        }

        return {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            friends: user.friends
        };
    }

    @Post('uploadAvatar')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile(
        new ParseFilePipeBuilder()
            .addFileTypeValidator({fileType: 'jpeg'})
            .addMaxSizeValidator({maxSize: 1000 * 1000 * 100})
            .build({errorHttpStatusCode: HttpStatus.BAD_REQUEST})) file: Express.Multer.File, @Req() request: AuthedRequest) {

        const newAvatar = file.buffer.toString('base64');

        await this.userService.updateUser(request.user, {
            id: request.user.id,
            avatar: `data:image/jpeg;charset=utf-8;base64, ${newAvatar}`,
        });

        return {message: 'Avatar Updated', statusCode: 200};
    }

    @Post('updateUsername')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async updateUsername(@Body('username') username: string, @Req() request: AuthedRequest) {
        if (!username) {
            throw new BadRequestException('Username not found');
        }

        await this.userService.updateUser(request.user, {
            id: request.user.id,
            username: username,
        });

        return {message: 'Username Updated', statusCode: 200};
    }

    @Get('enable2fa')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Header('content-type', 'image/png')
    async enable2faGet(@Req() request: AuthedRequest, @Res() response: Response) {
        if (request.user.two_factor_enabled) {
            throw new BadRequestException('2FA already enabled.');
        }

        const totp = await this.userService.generate2FASecret(request.user);
        return toFileStream(response, totp.toString());
    }

    @Post('enable2fa')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async enable2faPost(@Req() request: AuthedRequest, @Body('code') code: string) {
        if (!code) {
            throw new BadRequestException('Invalid parameters.');
        }

        if (request.user.two_factor_enabled) {
            throw new BadRequestException('2FA already enabled.');
        }

        const user = request.user;
        await this.userService.validate2FA(user, code);
        return {message: '2FA Enabled', statusCode: 200};
    }

    @Post('disable2fa')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async disable2fa(@Req() request: AuthedRequest) {
        await this.userService.disable2FA(request.user);
        return {message: '2FA Disabled', statusCode: 200};
    }

    @Post("friend/request")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async sendFriendRequest(@Req() request: AuthedRequest, @Body('userId') userId: string) {
        if (!userId) {
            throw new BadRequestException('User Id not found!');
        }

        return this.userService.sendFriendRequest(request.user, userId);
    }

    @Get("friend/request")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async getFriendRequests(@Req() request: AuthedRequest) {
        return this.userService.getFriendRequests(request.user);
    }

    @Post("friend/accept")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async acceptFriendRequest(@Req() request: AuthedRequest, @Body('requestId') requestId: string) {
        if (!requestId) {
            throw new BadRequestException('User Id not found!');
        }

        await this.userService.acceptFriendRequest(request.user, requestId);
        return {message: 'Friend request accepted', statusCode: 200};
    }

    @Post("friend/reject")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async rejectFriendRequest(@Req() request: AuthedRequest, @Body('requestId') requestId: string) {
        if (!requestId) {
            throw new BadRequestException('User Id not found!');
        }

        await this.userService.removeFriendRequest(request.user, requestId);
        return {message: 'Friend request rejected', statusCode: 200};
    }

    @Get("friend")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async getFriends(@Req() request: AuthedRequest, @Query('userId') userId: string) {
        if (!userId) {
            throw new BadRequestException('User Id not found!');
        }
        return this.userService.getFriends(userId);
    }

    @Post("block")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async addBlockedUser(@Req() request: AuthedRequest, @Body('userId') userId: string) {
        if (!userId) {
            throw new BadRequestException('User Id not found!');
        }

        await this.userService.blockUser(request.user, userId);
        return {message: 'Blocked user', statusCode: 200};
    }

    @Delete("block")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async removeBlockedUser(@Req() request: AuthedRequest, @Body('userId') userId: string) {
        if (!userId) {
            throw new BadRequestException('User Id not found!');
        }

        await this.userService.unblockUser(request.user, userId);
        return {message: 'Unblocked user', statusCode: 200};
    }
}
