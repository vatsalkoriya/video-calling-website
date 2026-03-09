import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/models/Room';
import { authenticate } from '@/lib/clerk-auth';

export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const authResult = await authenticate();
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
            room.participants.push(user.userId);
            await room.save();
        }

        const participantViews = room.participants.map((participantId) => {
            const isCurrentUser = participantId === user.userId;
            return {
                id: participantId,
                name: isCurrentUser ? user.name : 'Participant',
                email: isCurrentUser ? user.email : '',
            };
        });

        const isCurrentUserHost = room.hostId === user.userId;

        return NextResponse.json(
            {
                success: true,
                data: {
                    room: {
                        id: room._id,
                        roomId: room.roomId,
                        host: {
                            id: room.hostId,
                            name: isCurrentUserHost ? user.name : 'Host',
                            email: isCurrentUserHost ? user.email : '',
                        },
                        participants: participantViews,
                        createdAt: room.createdAt,
                        isActive: room.isActive,
                    },
                },
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('Room join error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to join room' },
            { status: 500 }
        );
    }
}
