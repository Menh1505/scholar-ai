import { Schema, Document, Types } from 'mongoose';

export interface DocumentItem {
  name: string;
  status: 'pending' | 'done' | 'expired';
  note?: string;
  updatedAt?: Date;
  uploadedFileUrl?: string;
}

export interface LegalDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId | string;
  school: string;
  documents: DocumentItem[];
  createdAt: Date;
  updatedAt: Date;
}

const DocumentItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: [
        'Passport',
        'I-20',
        'DS-160',
        'SEVIS Receipt',
        'Visa Application',
        'Financial Documents',
        'Academic Transcripts',
        'English Proficiency',
        'Health Insurance',
        'Other',
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'done', 'expired'],
      default: 'pending',
    },
    note: {
      type: String,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    uploadedFileUrl: {
      type: String,
    },
  },
  { _id: true },
);

export const LegalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    school: {
      type: String,
      required: true,
      trim: true,
    },
    documents: [DocumentItemSchema],
  },
  {
    timestamps: true,
  },
);
