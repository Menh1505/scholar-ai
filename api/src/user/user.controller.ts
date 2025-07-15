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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Get(':id')
  @AuthRequired()
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

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
    const token = req.cookies?.access_token as string;
    console.log('token: ', token);

    const user = (req as any).user;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Lấy thông tin chi tiết từ database
    const fullUserData = await this.userService.findOne(user.id);

    if (!fullUserData) {
      throw new Error('User not found');
    }

    return {
      id: fullUserData._id,
      email: fullUserData.email,
      fullname: fullUserData.fullname,
      dateOfBirth: fullUserData.dateOfBirth,
      phone: fullUserData.phone,
      passportCode: fullUserData.passportCode,
      scholarPoints: fullUserData.scholarPoints,
      createdAt: fullUserData.createdAt,
      updatedAt: fullUserData.updatedAt,
    };
  }
}
