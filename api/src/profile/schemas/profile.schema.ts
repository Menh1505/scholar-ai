import { Schema, Document } from 'mongoose';

export interface Profile extends Document {
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    avatar?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const ProfileSchema = new Schema({
    name: {
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
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
