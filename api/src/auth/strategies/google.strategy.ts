import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from '../../user/user.service';
import { GooglePayload } from '../auth.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GooglePayload,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;

    try {
      let user = await this.userService.findByEmail(emails[0].value);
      if (!user) {
        const createUserDto = {
          fullname: `${name.givenName} ${name.familyName}`,
          email: emails[0].value,
          phone: '',
          sex: 'other',
          dateOfBirth: '',
          nationality: '',
          religion: '',
          passportCode: ``,
          passportExpiryDate: '',
          scholarPoints: 0,
        };

        user = await this.userService.create(createUserDto);
      }

      if (user._id) {
        done(null, { userId: user._id });
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error, false);
    }
  }
}
