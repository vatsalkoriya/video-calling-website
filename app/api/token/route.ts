import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/models/Room';
import { authenticate } from '@/middleware/authMiddleware';
import { generateLiveKitToken, generateHostToken } from '@/lib/livekit';

export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const authResult = await authenticate(request);
        if (authResult instanceof NextResponse) {
            return authResult; // Return error response
        }
        const { user } = authResult;

        await connectDB();

        const body = await request.json();
        const { roomId } = body;

        if (!roomId) {
            return NextResponse.json(
                { success: false, error: 'Room ID is required' },
                { status: 400 }
            );
        }

        // Find room
        const room = await Room.findOne({ roomId, isActive: true });

        if (!room) {
            return NextResponse.json(
                { success: false, error: 'Room not found or inactive' },
                { status: 404 }
            );
        }

        // Check if user is the host
        const isHost = room.hostId.toString() === user.userId;

        // Generate appropriate token
        const tokenOptions = {
            roomName: roomId,
            participantName: user.name,
            participantIdentity: user.userId,
            metadata: JSON.stringify({
                userId: user.userId,
                email: user.email,
                isHost,
            }),
        };

        const token = isHost
            ? await generateHostToken(tokenOptions)
            : await generateLiveKitToken(tokenOptions);

        return NextResponse.json(
            {
                success: true,
                data: {
                    token,
                    roomName: roomId,
                    participantName: user.name,
                    participantIdentity: user.userId,
                    isHost,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Token generation error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to generate token' },
            { status: 500 }
        );
    }
}
