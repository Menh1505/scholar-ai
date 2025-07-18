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
} from '@nestjs/common';
import { AgentService } from './agent.service';

interface MessageRequest {
  userId: string;
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
  async handleMessage(
    @Body() body: MessageRequest,
    @Req() req: any,
  ): Promise<MessageResponse> {
    try {
      const { userId, message } = body;

      if (!userId || !message) {
        throw new BadRequestException('userId và message là bắt buộc');
      }

      if (typeof userId !== 'string' || typeof message !== 'string') {
        throw new BadRequestException('userId và message phải là string');
      }

      if (message.trim().length === 0) {
        throw new BadRequestException('Message không thể rỗng');
      }

      if (message.length > 1000) {
        throw new BadRequestException('Message quá dài (tối đa 1000 ký tự)');
      }

      const token = req.headers.authorization || '';

      this.logger.log(
        `Handling message from user ${userId}: ${message.substring(0, 50)}...`,
      );

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

  @Get('session/:userId')
  async getSession(@Param('userId') userId: string) {
    try {
      if (!userId) {
        throw new BadRequestException('userId là bắt buộc');
      }

      const session = await this.agentService.getOrCreateSession(userId);

      return {
        sessionId: (session as any)._id.toString(),
        userId: session.userId,
        phase: session.phase,
        selectedSchool: session.selectedSchool,
        selectedMajor: session.selectedMajor,
        userInfo: session.userInfo,
        isCompleted: session.isCompleted,
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

  @Get('session/:userId/history')
  async getMessageHistory(@Param('userId') userId: string, @Req() req: any) {
    try {
      if (!userId) {
        throw new BadRequestException('userId là bắt buộc');
      }

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

  @Delete('session/:userId')
  async resetSession(@Param('userId') userId: string) {
    try {
      if (!userId) {
        throw new BadRequestException('userId là bắt buộc');
      }

      await this.agentService.resetSession(userId);

      this.logger.log(`Session reset for user ${userId}`);

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

  @Post('session/:userId/complete')
  async completeSession(@Param('userId') userId: string) {
    try {
      if (!userId) {
        throw new BadRequestException('userId là bắt buộc');
      }

      await this.agentService.completeSession(userId);

      this.logger.log(`Session completed for user ${userId}`);

      return {
        message: 'Session đã hoàn thành thành công',
        userId,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Error completing session: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        {
          message: 'Có lỗi xảy ra khi hoàn thành session',
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
