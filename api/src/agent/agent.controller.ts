import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AuthRequired } from '../auth/decorators/auth-required.decorator';

@Controller('agent')
@AuthRequired()
export class AgentController {
    constructor(private readonly agentService: AgentService) { }

    @Post('chat/:userId')
    async chat(
        @Param('userId') userId: string,
        @Body() body: { message: string }
    ) {
        return await this.agentService.processConversation(userId, body.message);
    }

    @Get('conversation/:userId')
    async getConversation(@Param('userId') userId: string) {
        return await this.agentService.getConversationState(userId);
    }

    @Post('reset/:userId')
    async resetConversation(@Param('userId') userId: string) {
        return await this.agentService.resetConversation(userId);
    }

}
