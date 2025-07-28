// agent.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  Delete,
  Param,
  Get,
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { AgentService } from './agent.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface MessageRequest {
  message: string;
}

interface MessageResponse {
  response: string;
  phase: string;
  sessionId: string;
  timestamp: Date;
}

@Controller('agent')
export class AgentController {
  private readonly logger = new Logger(AgentController.name);

  constructor(private readonly agentService: AgentService) {}

  @Post('message')
  @UseGuards(JwtAuthGuard)
  async handleMessage(
    @Body() body: MessageRequest,
    @Req() req: any,
  ): Promise<MessageResponse> {
    try {
      const { message } = body;
      const userId = req.user.userId; // Lấy userId từ JWT token

      if (!message) {
        throw new BadRequestException('message là bắt buộc');
      }

      if (typeof message !== 'string') {
        throw new BadRequestException('message phải là string');
      }

      if (message.trim().length === 0) {
        throw new BadRequestException('Message không thể rỗng');
      }

      if (message.length > 1000) {
        throw new BadRequestException('Message quá dài (tối đa 1000 ký tự)');
      }

      const token = req.headers.authorization || '';

      const response = await this.agentService.handlePrompt(
        userId,
        message,
        token,
      );
      const session = await this.agentService.getOrCreateSession(userId);

      return {
        response,
        phase: session.phase,
        sessionId: (session as any)._id.toString(),
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Error handling message: ${error.message}`,
        error.stack,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Có lỗi xảy ra khi xử lý tin nhắn',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('session')
  @UseGuards(JwtAuthGuard)
  async getSession(@Req() req: any) {
    try {
      const userId = req.user.userId; // Lấy userId từ JWT token

      const session = await this.agentService.getOrCreateSession(userId);

      return {
        sessionId: (session as any)._id.toString(),
        userId: session.userId,
        phase: session.phase,
        schoolPreference:
          session.userInfo.schoolSelectionCriteria ||
          session.userInfo.preferredStudyCountry,
        majorPreference: session.userInfo.dreamMajor,
        userInfo: session.userInfo,
        progressPercentage: (session as any).progressPercentage,
        analytics: session.analytics,
        createdAt: (session as any).createdAt,
        updatedAt: (session as any).updatedAt,
      };
    } catch (error) {
      this.logger.error(`Error getting session: ${error.message}`, error.stack);
      throw new HttpException(
        {
          message: 'Có lỗi xảy ra khi lấy thông tin session',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('session/history')
  @UseGuards(JwtAuthGuard)
  async getMessageHistory(@Req() req: any) {
    try {
      const userId = req.user.userId; // Lấy userId từ JWT token

      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const session = await this.agentService.getOrCreateSession(userId);

      const messages = session.messages.slice(offset, offset + limit).reverse(); // Newest first

      return {
        messages,
        total: session.messages.length,
        limit,
        offset,
        hasMore: offset + limit < session.messages.length,
      };
    } catch (error) {
      this.logger.error(
        `Error getting message history: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        {
          message: 'Có lỗi xảy ra khi lấy lịch sử tin nhắn',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('session')
  @UseGuards(JwtAuthGuard)
  async resetSession(@Req() req: any) {
    try {
      const userId = req.user.userId; // Lấy userId từ JWT token

      await this.agentService.resetSession(userId);

      return {
        message: 'Session đã được reset thành công',
        userId,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Error resetting session: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        {
          message: 'Có lỗi xảy ra khi reset session',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date(),
      service: 'agent',
      version: '1.0.0',
    };
  }
}
