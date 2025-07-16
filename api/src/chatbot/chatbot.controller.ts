import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/cookie.decorator';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
// @UseGuards(JwtAuthGuard)
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get('history')
  async getHistory(@GetUser('id') userId: string) {
    return await this.chatbotService.getConversationHistory(userId);
  }
  @Get('document-checklist')
  async getDocumentChecklist(@GetUser('id') userId: string) {
    return await this.chatbotService.getDocumentChecklist(userId);
  }
}
