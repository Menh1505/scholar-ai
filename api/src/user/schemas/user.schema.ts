import { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
    fullname: string;
    email: string;
    phone: string;
    sex: string;
    dateOfBirth: string;
    nationality: string;
    religion: string;
    passportCode: string;
    passportExpiryDate: string;
    scholarPoints: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const UserSchema = new Schema({
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
        required: true,
        trim: true,
    },
    sex: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other'],
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
        trim: true,
    },
    religion: {
        type: String,
        required: true,
        trim: true,
    },
    passportCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    passportExpiryDate: {
        type: String,
        required: true,
    },
    scholarPoints: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
