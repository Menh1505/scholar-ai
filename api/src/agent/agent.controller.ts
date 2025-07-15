import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AgentService } from './agent.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { Request } from 'express';

@Controller('agent')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly userService: UserService,
  ) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  async chat(@Req() req: Request, @Body() body: { message: string }) {
    const user = (req as any).user;
    if (!user) {
      throw new Error('User not authenticated');
    }

    return await this.agentService.processConversation(user.id, body.message);
  }

  @Get('conversation')
  @UseGuards(JwtAuthGuard)
  async getConversation(@Req() req: Request) {
    const user = (req as any).user;
    if (!user) {
      throw new Error('User not authenticated');
    }

    return await this.agentService.getConversationState(user.id);
  }

  @Post('reset')
  @UseGuards(JwtAuthGuard)
  async resetConversation(@Req() req: Request) {
    const user = (req as any).user;
    if (!user) {
      throw new Error('User not authenticated');
    }

    return await this.agentService.resetConversation(user.id);
  }
}
