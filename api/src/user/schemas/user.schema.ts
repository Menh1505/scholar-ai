import { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  fullname: string;
  email: string;
  phone: string;
  sex: string;
  dateOfBirth: string;
  address: string;
  nationality: string;
  religion: string;
  passportCode: string;
  passportExpiryDate: string;
  scholarPoints: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    sex: {
      type: String,
      required: false,
      enum: ['male', 'female', 'other'],
    },
    dateOfBirth: {
      type: String,
      required: false,
    },
    nationality: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    religion: {
      type: String,
      required: false,
      trim: true,
    },
    passportCode: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    passportExpiryDate: {
      type: String,
      required: false,
    },
    scholarPoints: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
