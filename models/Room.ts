import mongoose, { Schema, Document, Model } from 'mongoose';
import { nanoid } from 'nanoid';

export interface IRoom extends Document {
    roomId: string;
    hostId: string;
    participants: string[];
    createdAt: Date;
    isActive: boolean;
}

const RoomSchema: Schema<IRoom> = new Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid(10), // Generate unique 10-character room ID
    },
    hostId: {
        type: String,
        required: true,
    },
    participants: [
        {
            type: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

// Index for faster lookups
RoomSchema.index({ roomId: 1 });
RoomSchema.index({ isActive: 1 });

// Prevent model recompilation in development
const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);

export default Room;
