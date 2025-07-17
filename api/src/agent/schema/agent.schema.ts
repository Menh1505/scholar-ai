import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AgentSessionDocument = AgentSession & Document;

export enum Phase {
  INTRO = 'intro',
  COLLECT_INFO = 'collect_info',
  SELECT_SCHOOL = 'select_school',
  LEGAL_CHECKLIST = 'legal_checklist',
  PROGRESS_TRACKING = 'progress_tracking',
}

export interface UserInfo {
  gpa?: number;
  toeflScore?: number;
  ieltsScore?: number;
  satScore?: number;
  desiredMajor?: string;
  budget?: number;
  preferredRegion?: string;
  academicBackground?: string;
  workExperience?: string;
}

export interface LegalDocument {
  name: string;
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  createdAt: Date;
  deadline?: Date;
  notes?: string;
}

export interface ChatMessage {
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    toolsUsed?: string[];
    phase?: Phase;
    actionTaken?: string;
  };
}

@Schema({ timestamps: true })
export class AgentSession {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ enum: Phase, default: Phase.INTRO })
  phase: Phase;

  @Prop()
  selectedSchool?: string;

  @Prop()
  selectedMajor?: string;

  @Prop({ type: Object, default: {} })
  userInfo: UserInfo;

  @Prop({
    type: [
      {
        name: String,
        id: String,
        status: {
          type: String,
          enum: ['pending', 'in_progress', 'completed', 'expired'],
          default: 'pending',
        },
        createdAt: { type: Date, default: Date.now },
        deadline: Date,
        notes: String,
      },
    ],
    default: [],
  })
  legalChecklist: LegalDocument[];

  @Prop({
    type: [
      {
        role: { type: String, enum: ['user', 'agent', 'system'] },
        content: String,
        timestamp: { type: Date, default: Date.now },
        metadata: {
          toolsUsed: [String],
          phase: { type: String, enum: Object.values(Phase) },
          actionTaken: String,
        },
      },
    ],
    default: [],
  })
  messages: ChatMessage[];

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop()
  completedAt?: Date;

  @Prop({ type: Object, default: {} })
  preferences: {
    language?: string;
    timezone?: string;
    notificationSettings?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };

  @Prop({ type: Object, default: {} })
  analytics: {
    totalMessages?: number;
    averageResponseTime?: number;
    toolsUsageCount?: Record<string, number>;
    phaseTransitions?: Array<{
      from: Phase;
      to: Phase;
      timestamp: Date;
    }>;
  };
}

export const AgentSessionSchema = SchemaFactory.createForClass(AgentSession);

// Add indexes for better performance
AgentSessionSchema.index({ userId: 1 });
AgentSessionSchema.index({ phase: 1 });
AgentSessionSchema.index({ 'messages.timestamp': -1 });
AgentSessionSchema.index({ updatedAt: -1 });

// Add virtual for session duration
AgentSessionSchema.virtual('sessionDuration').get(function () {
  if (this.completedAt && (this as any).createdAt) {
    return this.completedAt.getTime() - (this as any).createdAt.getTime();
  }
  return null;
});

// Add virtual for progress percentage
AgentSessionSchema.virtual('progressPercentage').get(function () {
  if (this.legalChecklist.length === 0) return 0;

  const completedCount = this.legalChecklist.filter(
    (doc) => doc.status === 'completed',
  ).length;

  return Math.round((completedCount / this.legalChecklist.length) * 100);
});

// Pre-save middleware to update analytics
AgentSessionSchema.pre('save', function (next) {
  if (this.isModified('messages')) {
    this.analytics.totalMessages = this.messages.length;
  }

  if (this.isModified('phase')) {
    if (!this.analytics.phaseTransitions) {
      this.analytics.phaseTransitions = [];
    }

    // Only add transition if it's actually changing
    const lastTransition =
      this.analytics.phaseTransitions[
        this.analytics.phaseTransitions.length - 1
      ];
    if (!lastTransition || lastTransition.to !== this.phase) {
      this.analytics.phaseTransitions.push({
        from: lastTransition ? lastTransition.to : Phase.INTRO,
        to: this.phase,
        timestamp: new Date(),
      });
    }
  }

  next();
});
