import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import { authenticate } from '@/lib/clerk-auth';

// Get messages for a room
export async function GET(request: NextRequest) {
    try {
        const authResult = await authenticate();
        if (authResult instanceof NextResponse) {
            return authResult;
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const roomId = searchParams.get('roomId');

        if (!roomId) {
            return NextResponse.json(
                { success: false, error: 'Room ID is required' },
                { status: 400 }
            );
        }

        // Get messages for the room, sorted by timestamp
        const messages = await Message.find({ roomId })
            .sort({ timestamp: 1 })
            .limit(100) // Limit to last 100 messages
            .lean();

        return NextResponse.json(
            {
                success: true,
                data: { messages },
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('Get messages error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to get messages' },
            { status: 500 }
        );
    }
}

// Save a message
export async function POST(request: NextRequest) {
    try {
        const authResult = await authenticate();
        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const { user } = authResult;

        await connectDB();

        const body = await request.json();
        const { roomId, message } = body;

        if (!roomId || !message) {
            return NextResponse.json(
                { success: false, error: 'Room ID and message are required' },
                { status: 400 }
            );
        }

        // Create message
        const newMessage = await Message.create({
            roomId,
            senderId: user.userId,
            senderName: user.name,
            message,
        });

        return NextResponse.json(
            {
                success: true,
                data: { message: newMessage },
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Save message error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to save message' },
            { status: 500 }
        );
    }
}
