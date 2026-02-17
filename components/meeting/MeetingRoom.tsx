'use client';

import { useEffect, useState } from 'react';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useRoomStore } from '@/store/useRoomStore';
import VideoGrid from './VideoGrid';
import ControlBar from './ControlBar';
import Chat from './Chat';
import ParticipantsList from './ParticipantsList';

interface MeetingRoomProps {
    roomId: string;
}

export default function MeetingRoom({ roomId }: MeetingRoomProps) {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const clearRoom = useRoomStore((state) => state.clearRoom);

    const [livekitToken, setLivekitToken] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
    const [isHost, setIsHost] = useState(false);

    const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';

    useEffect(() => {
        if (!token || !user) {
            router.push('/');
            return;
        }

        fetchLiveKitToken();
    }, [roomId, token, user]);

    const fetchLiveKitToken = async () => {
        try {
            const response = await fetch('/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ roomId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get token');
            }

            setLivekitToken(data.data.token);
            setIsHost(data.data.isHost);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = () => {
        clearRoom();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Joining meeting...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md">
                    <h2 className="text-red-400 text-xl font-semibold mb-2">Error</h2>
                    <p className="text-red-300 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
            <LiveKitRoom
                token={livekitToken}
                serverUrl={serverUrl}
                connect={true}
                video={true}
                audio={true}
                onDisconnected={handleDisconnect}
                className="flex-1 flex flex-col min-h-0"
            >
                <div className="flex-1 flex min-h-0">
                    <VideoGrid />

                    {isParticipantsOpen && (
                        <ParticipantsList isHost={isHost} />
                    )}

                    {isChatOpen && (
                        <Chat roomId={roomId} />
                    )}
                </div>

                <ControlBar
                    onToggleChat={() => {
                        setIsChatOpen(!isChatOpen);
                        setIsParticipantsOpen(false);
                    }}
                    onToggleParticipants={() => {
                        setIsParticipantsOpen(!isParticipantsOpen);
                        setIsChatOpen(false);
                    }}
                    isChatOpen={isChatOpen}
                    isParticipantsOpen={isParticipantsOpen}
                    onLeave={handleDisconnect}
                />
                <RoomAudioRenderer />
            </LiveKitRoom>
        </div>
    );
}
