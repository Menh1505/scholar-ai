import { Schema, Document, Types } from 'mongoose';

export interface ConversationState {
    userId: Types.ObjectId;
    phase: 'introduction' | 'collect-info' | 'recommend-majors' | 'recommend-schools' | 'legal' | 'completed';
    selectedSchool?: string;
    selectedMajor?: string;
    legalChecklist?: string[];
    userProfile?: {
        name?: string;
        email?: string;
        phone?: string;
        gpa?: number;
        englishScore?: string;
        interestedMajors?: string[];
        budget?: number;
        preferredState?: string;
        immigrationGoal?: boolean;
    };
    recommendations?: {
        majors?: any[];
        schools?: any[];
    };
    awaitingResponse?: string;
    lastMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ConversationDocument extends Document {
    userId: Types.ObjectId;
    phase: 'introduction' | 'collect-info' | 'recommend-majors' | 'recommend-schools' | 'legal' | 'completed';
    selectedSchool?: string;
    selectedMajor?: string;
    legalChecklist?: string[];
    userProfile?: {
        name?: string;
        email?: string;
        phone?: string;
        gpa?: number;
        englishScore?: string;
        interestedMajors?: string[];
        budget?: number;
        preferredState?: string;
        immigrationGoal?: boolean;
    };
    recommendations?: {
        majors?: any[];
        schools?: any[];
    };
    awaitingResponse?: string;
    lastMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const ConversationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    phase: {
        type: String,
        enum: ['introduction', 'collect-info', 'recommend-majors', 'recommend-schools', 'legal', 'completed'],
        default: 'introduction'
    },
    selectedSchool: {
        type: String
    },
    selectedMajor: {
        type: String
    },
    legalChecklist: [{
        type: String
    }],
    userProfile: {
        name: String,
        email: String,
        phone: String,
        gpa: Number,
        englishScore: String,
        interestedMajors: [String],
        budget: Number,
        preferredState: String,
        immigrationGoal: Boolean
    },
    recommendations: {
        majors: [{
            name: String,
            description: String,
            matchScore: Number,
            reasons: [String],
            careerProspects: [String],
            averageSalary: Number
        }],
        schools: [{
            name: String,
            state: String,
            ranking: Number,
            tuition: Number,
            matchScore: Number,
            reasons: [String]
        }]
    },
    awaitingResponse: {
        type: String
    },
    lastMessage: {
        type: String
    }
}, {
    timestamps: true
});

// Index for better query performance
ConversationSchema.index({ userId: 1, updatedAt: -1 });
