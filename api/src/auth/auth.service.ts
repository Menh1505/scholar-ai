import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  googleLogin(userId: string) {
    return {
      access_token: this.jwtService.sign(
        { userId },
        {
          secret: process.env.JWT_SECRET,
        },
      ),
    };
  }

  async validateUser(userId: string) {
    const user = await this.userService.findOne(userId);
    return user;
  }

  generateJwt(userId: string) {
    return {
      access_token: this.jwtService.sign(userId),
      user: userId,
    };
  }
}
