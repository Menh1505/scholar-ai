import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as { userId: string };

    if (!user || !user.userId) {
      throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED);
    }

    const result = this.authService.googleLogin(user.userId);

    // Set JWT as httpOnly cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend without token in URL
    const redirectUrl = `${this.configService.get<string>('FRONTEND_URL') + '/profile' || 'http://localhost:3001'}`;
    res.redirect(redirectUrl);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  refreshToken(@Req() req: Request, @Res() res: Response) {
    const user = req.user as { userId: string };

    if (!user || !user.userId) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const result = this.authService.generateJwt(user.userId);

    // Update cookie with new token
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json(result);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('access_token');
    return res.json({ message: 'Logout successful' });
  }
}
