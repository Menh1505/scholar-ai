import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

export enum ConversationPhase {
  INFORMATION_GATHERING = 'information_gathering',
  CONSULTATION = 'consultation',
  DOCUMENT_PREPARATION = 'document_preparation',
  APPLICATION_SUPPORT = 'application_support',
}

export interface State {
  userId: string; // ai đang trò chuyện
  userExpandInformation: string;
  phase: ConversationPhase; // Đang ở giai đoạn nào
  selectedSchool: string; // Trường đã chọn
  selectedMajor: string; // Nghành đã chọn
  plan: string; // kế hoạch du học mà người dùng đã thống nhất với agent
  studentInfo: {
    name?: string;
    email?: string;
    phone?: string;
    age?: number;
    currentEducation?: string;
    targetCountries?: string[];
    targetPrograms?: string[];
    budget?: string;
    englishLevel?: string;
    timeline?: string;
    specialRequirements?: string;
  };
  lastUpdated: Date;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [Object], default: [] })
  messages: Message[];

  @Prop({ type: Object, default: {} })
  state: State;

  @Prop({ default: true })
  isActive: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
