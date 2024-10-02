import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {AuthService} from './auth.service';
import {AuthedRequest, AuthWithout2FAGuard, NotAuthGuard} from './auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private configService: ConfigService, private authService: AuthService) {
    }

    @UseGuards(NotAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('/42')
    ftAuth() {
        return {redirect_url: `https://api.intra.42.fr/oauth/authorize?client_id=${this.configService.getOrThrow<string>('FT_CLIENT_ID')}&redirect_uri=${this.configService.getOrThrow('FRONTEND_DOMAIN')}/42_auth&response_type=code&scope=public`};
    }

    @UseGuards(NotAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('/google')
    googleAuth() {
        return {redirect_url: `https://accounts.google.com/o/oauth2/v2/auth?scope=openid profile email&include_granted_scopes=true&response_type=code&client_id=${this.configService.getOrThrow('GOOGLE_CLIENT_ID')}&redirect_uri=${this.configService.getOrThrow('FRONTEND_DOMAIN')}/google_auth`}
    }

    @UseGuards(NotAuthGuard)
    @Get('/google/callback')
    @HttpCode(HttpStatus.OK)
    async googleCallback(@Query('code') code: string) {
        if (!code) {
            throw new UnauthorizedException('Code not found!');
        }

        return await this.authService.authGoogleUser(code);
    }

    @UseGuards(NotAuthGuard)
    @Get('/42/callback')
    @HttpCode(HttpStatus.OK)
    async ftCallback(@Query('code') code: string) {
        if (!code) {
            throw new UnauthorizedException('Code not found!');
        }

        return await this.authService.auth42User(code);
    }

    @Post('refreshToken')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body('refresh_token') refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh Token not found!');
        }

        return await this.authService.refreshToken(refreshToken);
    }

    @UseGuards(AuthWithout2FAGuard)
    @Post('2fa')
    @HttpCode(HttpStatus.OK)
    async twoFactorAuthentication(@Body('code') code: string, @Req() request: AuthedRequest) {
        if (!code) {
            throw new UnauthorizedException('Code not found!');
        }

        return this.authService.twoFactorAuthentication(request.user, code);
    }

}
