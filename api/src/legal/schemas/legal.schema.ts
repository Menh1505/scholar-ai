import { Schema, Document, Types } from 'mongoose';

export interface LegalDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  userId: Types.ObjectId | string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

export const LegalSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'in_progress', 'completed', 'expired'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);
