import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/models/Room';
import User from '@/models/User';
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
        const room = await Room.findOne({ roomId, isActive: true });

        if (!room) {
            return NextResponse.json(
                { success: false, error: 'Room not found or inactive' },
                { status: 404 }
            );
        }

        // Check if user is already in the room
        const isAlreadyParticipant = room.participants.some(
            (participantId) => participantId.toString() === user.userId
        );

        if (!isAlreadyParticipant) {
            // Add user to participants
            room.participants.push(user.userId as any);
            await room.save();
        }

        // Populate host and participants
        await room.populate('hostId', 'name email');
        await room.populate('participants', 'name email');

        return NextResponse.json(
            {
                success: true,
                data: {
                    room: {
                        id: room._id,
                        roomId: room.roomId,
                        host: {
                            id: room.hostId._id,
                            name: (room.hostId as any).name,
                            email: (room.hostId as any).email,
                        },
                        participants: (room.participants as any[]).map((p) => ({
                            id: p._id,
                            name: p.name,
                            email: p.email,
                        })),
                        createdAt: room.createdAt,
                        isActive: room.isActive,
                    },
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Room join error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to join room' },
            { status: 500 }
        );
    }
}
