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

        // Create new room
        const room = await Room.create({
            hostId: user.userId,
            participants: [user.userId],
        });

        // Populate host information
        await room.populate('hostId', 'name email');

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
                        participants: room.participants,
                        createdAt: room.createdAt,
                        isActive: room.isActive,
                    },
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Room creation error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create room' },
            { status: 500 }
        );
    }
}
