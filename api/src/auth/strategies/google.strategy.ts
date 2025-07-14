import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from '../../user/user.service';

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
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { id, name, emails, photos } = profile;

        try {
            // Kiểm tra user đã tồn tại chưa
            let user = await this.userService.findByEmail(emails[0].value);

            if (!user) {
                // Tạo user mới nếu chưa tồn tại
                const createUserDto = {
                    fullname: `${name.givenName} ${name.familyName}`,
                    email: emails[0].value,
                    phone: '',
                    sex: 'other',
                    dateOfBirth: '',
                    nationality: '',
                    religion: '',
                    passportCode: `GOOGLE_${id}`,
                    passportExpiryDate: '',
                    scholarPoints: 0,
                };

                user = await this.userService.create(createUserDto);
            }

            const payload = {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                googleId: id,
            };

            done(null, payload);
        } catch (error) {
            done(error, false);
        }
    }
}
