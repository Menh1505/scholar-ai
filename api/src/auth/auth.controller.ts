import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as { userId: string };
    const result = this.authService.googleLogin(user.userId);
    // Set JWT as httpOnly cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend without token in URL
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}`;
    res.redirect(redirectUrl);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  refreshToken(@Req() req: { userId: string }, @Res() res: Response) {
    const result = this.authService.generateJwt(req.userId);

    // Update cookie with new token
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logout successful' };
  }
}
