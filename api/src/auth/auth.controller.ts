import { Controller, Get, Post, UseGuards, Req, Res, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req: Request) {
    // Redirects to Google OAuth
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);

    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/auth/callback?token=${result.access_token}`;
    res.redirect(redirectUrl);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Req() req: any) {
    return this.authService.generateJwt(req.user);
  }
}
