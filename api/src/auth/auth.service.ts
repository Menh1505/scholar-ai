import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  async googleLogin(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      googleId: user.googleId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  async validateUser(payload: any) {
    const user = await this.userService.findOne(payload.id);
    return user;
  }

  async generateJwt(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: payload,
    };
  }
}
