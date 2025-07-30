// agent.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { AgentService } from './agent.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AgentSessionService } from './services/agent.session.service';

interface MessageRequest {
  message: string;
}

interface MessageResponse {
  response: string;
  timestamp: Date;
}

@Controller('agent')
export class AgentController {
  private readonly logger = new Logger(AgentController.name);

  constructor(
    private readonly agentService: AgentService,
    private readonly sessionService: AgentSessionService,
  ) {}

  @Post('message')
  @UseGuards(JwtAuthGuard)
  async handleMessage(
    @Body() body: MessageRequest,
    @Req() req: any,
  ): Promise<MessageResponse> {
    try {
      const { message } = body;
      const userId = req.user.userId; // Lấy userId từ JWT token

      if (
        !message ||
        typeof message !== 'string' ||
        message.trim().length === 0
      ) {
        throw new BadRequestException('Invalid Message');
      }

      const response = await this.agentService.handlePrompt(userId, message);

      return {
        response,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Error handling message: ${error.message}`,
        error.stack,
      );

      throw new HttpException(
        {
          message: 'Có lỗi xảy ra khi xử lý tin nhắn',
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

      const session = await this.sessionService.getOrCreateSession(userId);

      const messages = session.messages.slice(offset, offset + limit); // Newest first

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
