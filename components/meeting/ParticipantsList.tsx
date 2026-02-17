'use client';

import { useParticipants, useRoomContext } from '@livekit/components-react';
import { User, Shield, Mic, MicOff, Video, VideoOff, MoreVertical } from 'lucide-react';
import { Participant } from 'livekit-client';

interface ParticipantsListProps {
    isHost: boolean;
}

export default function ParticipantsList({ isHost }: ParticipantsListProps) {
    const participants = useParticipants();
    const room = useRoomContext();

    const handleRemoveParticipant = (p: Participant) => {
        if (!isHost || p.isLocal) return;

        if (confirm(`Are you sure you want to remove ${p.name || p.identity}?`)) {
            console.log('Remove participant:', p.identity);
            alert('Removal of participants requires a server-side API call using the LiveKit Server SDK, which is not implemented in this client-side demo.');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 w-80">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white">Participants ({participants.length})</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {participants.map((p) => {
                    const metadata = p.metadata ? JSON.parse(p.metadata) : {};
                    const isParticipantHost = metadata.isHost;

                    return (
                        <div
                            key={p.sid}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                    {p.name ? p.name[0].toUpperCase() : <User size={14} />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                        {p.name || p.identity}
                                        {p.isLocal && <span className="text-[10px] text-gray-500">(You)</span>}
                                        {isParticipantHost && <Shield size={12} className="text-amber-500" />}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {p.isMicrophoneEnabled ? (
                                    <Mic size={14} className="text-gray-500" />
                                ) : (
                                    <MicOff size={14} className="text-red-500" />
                                )}

                                {isHost && !p.isLocal && (
                                    <button
                                        onClick={() => handleRemoveParticipant(p)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 transition-all"
                                        title="Remove participant"
                                    >
                                        <MoreVertical size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {isHost && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        className="w-full py-2 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                        onClick={() => {
                            if (confirm('Mute all participants?')) {
                                // Logic to mute all (would need server-side API or custom data messages)
                            }
                        }}
                    >
                        Mute All
                    </button>
                </div>
            )}
        </div>
    );
}
