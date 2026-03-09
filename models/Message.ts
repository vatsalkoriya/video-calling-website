import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
    roomId: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: Date;
}

const MessageSchema: Schema<IMessage> = new Schema({
    roomId: {
        type: String,
        required: true,
        index: true, // Index for faster queries
    },
    senderId: {
        type: String,
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Compound index for efficient room message queries
MessageSchema.index({ roomId: 1, timestamp: -1 });

// Prevent model recompilation in development
const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
