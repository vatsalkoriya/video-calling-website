import MeetingRoom from '@/components/meeting/MeetingRoom';

interface RoomPageProps {
    params: {
        roomId: string;
    };
}

export default function RoomPage({ params }: RoomPageProps) {
    return <MeetingRoom roomId={params.roomId} />;
}
