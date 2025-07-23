import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { LegalService } from './legal.service';
import { CreateLegalDto } from './dto/create-legal.dto';
import { UpdateLegalDto } from './dto/update-legal.dto';
import { AuthRequired } from '../auth/decorators/auth-required.decorator';

@Controller('legal')
@AuthRequired()
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  @Post()
  async create(
    @Body() createLegalDto: CreateLegalDto,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const data = await this.legalService.create(createLegalDto);
      return {
        success: true,
        message: 'Legal document created successfully',
        data,
      };
    } catch (error) {
      console.log('[Error]', error);
      return {
        success: false,
        message: 'Failed to create legal document',
      };
    }
  }

  @Get('me')
  async findMyDocuments(
    @Req() req: any,
  ): Promise<{ success: boolean; data: any[] }> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return { success: false, data: [] };
      }

      const data = await this.legalService.findByUserId(userId);
      return { success: true, data };
    } catch (error) {
      console.log('[Error]', error);
      return { success: false, data: [] };
    }
  }

  @Get('user/:userId')
  async findByUserId(
    @Param('userId') userId: string,
  ): Promise<{ success: boolean; data: any[] }> {
    try {
      const data = await this.legalService.findByUserId(userId);
      return { success: true, data };
    } catch (error) {
      console.log('[Error]', error);
      return { success: false, data: [] };
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const data = await this.legalService.findOne(id);
      return { success: true, data };
    } catch (error: any) {
      console.log('[Error]', error);
      return {
        success: false,
        message: 'Legal document not found',
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLegalDto: UpdateLegalDto,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const data = await this.legalService.update(id, updateLegalDto);
      return {
        success: true,
        message: 'Legal document updated successfully',
        data,
      };
    } catch (error: any) {
      console.log('[Error]', error);
      return {
        success: false,
        message: 'Failed to update legal document',
      };
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.legalService.remove(id);
      return { success: true, message: 'Legal document deleted successfully' };
    } catch (error: any) {
      console.log('[Error]', error);
      return {
        success: false,
        message: 'Failed to delete legal document',
      };
    }
  }
}
