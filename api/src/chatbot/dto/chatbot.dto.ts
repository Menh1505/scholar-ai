import { IsString, IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class ConversationResponseDto {
  id: string;
  response: string;
  conversationId: string;
  phase: string;
  suggestions: string[];
}
