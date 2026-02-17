import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/models/Room';
import { authenticate } from '@/middleware/authMiddleware';

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
        const room = await Room.findOne({ roomId });

        if (!room) {
            return NextResponse.json(
                { success: false, error: 'Room not found' },
                { status: 404 }
            );
        }

        // Remove user from participants
        room.participants = room.participants.filter(
            (participantId) => participantId.toString() !== user.userId
        );

        // If no participants left, mark room as inactive
        if (room.participants.length === 0) {
            room.isActive = false;
        }

        await room.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully left the room',
                data: {
                    roomId: room.roomId,
                    isActive: room.isActive,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Room leave error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to leave room' },
            { status: 500 }
        );
    }
}
