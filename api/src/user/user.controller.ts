import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateScholarPointsDto } from './dto/update-scholar-points.dto';
import { AuthRequired } from '../auth/decorators/auth-required.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/auth.type';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @AuthRequired()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @AuthRequired()
  findAll() {
    return this.userService.findAll();
  }

  @Get('top-scholars')
  getTopScholars(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit) : 10;
    return this.userService.getTopScholars(limitNumber);
  }

  @Get('email/:email')
  @AuthRequired()
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get('passport/:passportCode')
  @AuthRequired()
  findByPassportCode(@Param('passportCode') passportCode: string) {
    return this.userService.findByPassportCode(passportCode);
  }

  /*   @Get(':id')
  @AuthRequired()
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  } */

  @Patch(':id')
  @AuthRequired()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/scholar-points')
  @AuthRequired()
  updateScholarPoints(
    @Param('id') id: string,
    @Body() updateScholarPointsDto: UpdateScholarPointsDto,
  ) {
    return this.userService.updateScholarPoints(
      id,
      updateScholarPointsDto.points,
    );
  }

  @Delete(':id')
  @AuthRequired()
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Delete(':id/hard')
  @AuthRequired()
  hardDelete(@Param('id') id: string) {
    return this.userService.hardDelete(id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request) {
    const user = req.user as JwtPayload;

    const fullUserData = await this.userService.findOne(user.userId);

    if (!fullUserData) {
      throw new Error('User not found');
    }

    return {
      id: fullUserData._id,
      fullname: fullUserData.fullname,
      email: fullUserData.email,
      phone: fullUserData.phone,
      sex: fullUserData.sex,
      dateOfBirth: fullUserData.dateOfBirth,
      nationality: fullUserData.nationality,
      religion: fullUserData.religion,
      passportCode: fullUserData.passportCode,
      passportExpiryDate: fullUserData.passportExpiryDate,
      scholarPoints: fullUserData.scholarPoints,
    };
  }
}
