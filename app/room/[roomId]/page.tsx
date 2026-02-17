import MeetingRoom from '@/components/meeting/MeetingRoom';

interface RoomPageProps {
    params: Promise<{
        roomId: string;
    }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
    const { roomId } = await params;
    return <MeetingRoom roomId={roomId} />;
}

