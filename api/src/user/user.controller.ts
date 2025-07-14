import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateScholarPointsDto } from './dto/update-scholar-points.dto';
import { AuthRequired } from '../auth/decorators/auth-required.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @AuthRequired()
  create(@Body() createUserDto: CreateUserDto, @CurrentUser() user: any) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @AuthRequired()
  findAll(@CurrentUser() user: any) {
    return this.userService.findAll();
  }

  @Get('top-scholars')
  getTopScholars(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit) : 10;
    return this.userService.getTopScholars(limitNumber);
  }

  @Get('email/:email')
  @AuthRequired()
  findByEmail(@Param('email') email: string, @CurrentUser() user: any) {
    return this.userService.findByEmail(email);
  }

  @Get('passport/:passportCode')
  @AuthRequired()
  findByPassportCode(@Param('passportCode') passportCode: string, @CurrentUser() user: any) {
    return this.userService.findByPassportCode(passportCode);
  }

  @Get(':id')
  @AuthRequired()
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @AuthRequired()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() user: any) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/scholar-points')
  @AuthRequired()
  updateScholarPoints(
    @Param('id') id: string,
    @Body() updateScholarPointsDto: UpdateScholarPointsDto,
    @CurrentUser() user: any
  ) {
    return this.userService.updateScholarPoints(id, updateScholarPointsDto.points);
  }

  @Delete(':id')
  @AuthRequired()
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.userService.remove(id);
  }

  @Delete(':id/hard')
  @AuthRequired()
  hardDelete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.userService.hardDelete(id);
  }
}
