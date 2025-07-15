import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Thứ tự ưu tiên: cookie -> header -> query
        (request: Request) => {
          return request?.cookies?.['access_token'];
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret',
    });
  }

  async validate(payload: any) {
    // Tìm user từ database để đảm bảo user vẫn tồn tại
    const user = await this.userService.findOne(payload.id);

    if (!user) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
    };
  }
}
