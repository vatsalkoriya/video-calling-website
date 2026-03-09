import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/models/Room';
import { authenticate } from '@/lib/clerk-auth';

export async function POST() {
    try {
        // Authenticate user
        const authResult = await authenticate();
        if (authResult instanceof NextResponse) {
            return authResult; // Return error response
        }
        const { user } = authResult;

        await connectDB();

        // Create new room
        const room = await Room.create({
            hostId: user.userId,
            participants: [user.userId],
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    room: {
                        id: room._id,
                        roomId: room.roomId,
                        host: {
                            id: user.userId,
                            name: user.name,
                            email: user.email,
                        },
                        participants: [
                            {
                                id: user.userId,
                                name: user.name,
                                email: user.email,
                            },
                        ],
                        createdAt: room.createdAt,
                        isActive: room.isActive,
                    },
                },
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Room creation error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to create room' },
            { status: 500 }
        );
    }
}
