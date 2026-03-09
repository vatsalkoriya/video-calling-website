'use client';

import { useCallback, useEffect, useState } from 'react';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
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
    const { isLoaded, isSignedIn } = useAuth();
    const clearRoom = useRoomStore((state) => state.clearRoom);

    const [livekitToken, setLivekitToken] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [permissionError, setPermissionError] = useState(false);
    const [atmosphere, setAtmosphere] = useState('Classic');

    const getAtmosphereClass = () => {
        switch (atmosphere) {
            case 'Midnight': return 'bg-black';
            case 'Aurora': return 'bg-gradient-to-br from-gray-900 via-emerald-900/20 to-gray-900';
            case 'Sunset': return 'bg-gradient-to-br from-gray-900 via-orange-900/20 to-gray-900';
            default: return 'bg-gray-900';
        }
    };

    const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';

    const fetchLiveKitToken = useCallback(async () => {
        try {
            const response = await fetch('/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get token');
            }

            setLivekitToken(data.data.token);
            setIsHost(data.data.isHost);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to get token');
        } finally {
            setLoading(false);
        }
    }, [roomId]);

    useEffect(() => {
        if (!isLoaded) {
            return;
        }

        if (!isSignedIn) {
            router.push('/sign-in');
            return;
        }

        fetchLiveKitToken();
    }, [fetchLiveKitToken, isLoaded, isSignedIn, router]);

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                // Stop the tracks immediately as we just wanted to check permission
                stream.getTracks().forEach(track => track.stop());
            } catch (err: unknown) {
                console.error('Permission check error:', err);
                if (
                    err instanceof DOMException &&
                    (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
                ) {
                    setPermissionError(true);
                }
            }
        };

        if (livekitToken) {
            checkPermissions();
        }
    }, [livekitToken]);

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

    if (error || permissionError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-8 max-w-md text-center">
                    <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m12 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" />
                        </svg>
                    </div>
                    <h2 className="text-red-400 text-2xl font-bold mb-4">
                        {permissionError ? 'Permission Denied' : 'Error'}
                    </h2>
                    <p className="text-red-300 mb-8 text-lg">
                        {permissionError
                            ? 'Camera or microphone access was denied. Please allow camera and microphone permissions in your browser settings to join the meeting.'
                            : error}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-900/40"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-screen flex flex-col overflow-hidden transition-all duration-1000 ${getAtmosphereClass()}`}>
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
                    roomId={roomId}
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
                    atmosphere={atmosphere}
                    onAtmosphereChange={setAtmosphere}
                />
                <RoomAudioRenderer />
            </LiveKitRoom>
        </div>
    );
}
