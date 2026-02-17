'use client';

import {
    Mic, MicOff, Video, VideoOff,
    MonitorUp, MessageSquare, Users, PhoneOff,
    Settings, ChevronUp
} from 'lucide-react';
import { useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';

interface ControlBarProps {
    onToggleChat: () => void;
    onToggleParticipants: () => void;
    isChatOpen: boolean;
    isParticipantsOpen: boolean;
    onLeave: () => void;
}

export default function ControlBar({
    onToggleChat,
    onToggleParticipants,
    isChatOpen,
    isParticipantsOpen,
    onLeave
}: ControlBarProps) {
    const {
        isMicrophoneEnabled,
        isCameraEnabled,
        isScreenShareEnabled,
        localParticipant,
    } = useLocalParticipant();

    return (
        <div className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-6">
            {/* Left side: Meeting Info */}
            <div className="flex items-center gap-2 text-white">
                <span className="font-medium text-sm">Meeting Details</span>
                <ChevronUp size={16} className="text-gray-400" />
            </div>

            {/* Middle: Controls */}
            <div className="flex items-center gap-4">
                {/* Mic */}
                <button
                    onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
                    className={`p-3 rounded-full transition-all ${isMicrophoneEnabled
                        ? 'bg-gray-800 hover:bg-gray-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                >
                    {isMicrophoneEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                </button>

                {/* Camera */}
                <button
                    onClick={() => localParticipant.setCameraEnabled(!isCameraEnabled)}
                    className={`p-3 rounded-full transition-all ${isCameraEnabled
                        ? 'bg-gray-800 hover:bg-gray-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                >
                    {isCameraEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                </button>

                {/* Screen Share */}
                <button
                    onClick={() => localParticipant.setScreenShareEnabled(!isScreenShareEnabled)}
                    className={`p-3 rounded-full transition-all ${isScreenShareEnabled
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                        }`}
                >
                    <MonitorUp size={20} />
                </button>

                {/* Leave */}
                <button
                    onClick={onLeave}
                    className="ml-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                >
                    <div className="flex items-center gap-2">
                        <PhoneOff size={18} />
                        <span>Leave</span>
                    </div>
                </button>
            </div>

            {/* Right side: Panels */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onToggleParticipants}
                    className={`p-3 text-gray-400 hover:text-white transition-colors relative ${isParticipantsOpen ? 'text-blue-500' : ''
                        }`}
                >
                    <Users size={20} />
                    {isParticipantsOpen && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />}
                </button>

                <button
                    onClick={onToggleChat}
                    className={`p-3 text-gray-400 hover:text-white transition-colors relative ${isChatOpen ? 'text-blue-500' : ''
                        }`}
                >
                    <MessageSquare size={20} />
                    {isChatOpen && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />}
                </button>

                <button className="p-3 text-gray-400 hover:text-white transition-colors">
                    <Settings size={20} />
                </button>
            </div>
        </div>
    );
}
