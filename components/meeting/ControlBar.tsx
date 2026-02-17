'use client';

import { useEffect, useState } from 'react';
import {
    Mic, MicOff, Video, VideoOff,
    MonitorUp, MessageSquare, Users, PhoneOff,
    Settings, ChevronUp
} from 'lucide-react';
import { useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';

import SettingsModal from './SettingsModal';

interface ControlBarProps {
    roomId: string;
    onToggleChat: () => void;
    onToggleParticipants: () => void;
    isChatOpen: boolean;
    isParticipantsOpen: boolean;
    onLeave: () => void;
    atmosphere: string;
    onAtmosphereChange: (atmosphere: string) => void;
}

export default function ControlBar({
    roomId,
    onToggleChat,
    onToggleParticipants,
    isChatOpen,
    isParticipantsOpen,
    onLeave,
    atmosphere,
    onAtmosphereChange
}: ControlBarProps) {
    const {
        isMicrophoneEnabled,
        isCameraEnabled,
        isScreenShareEnabled,
        localParticipant,
    } = useLocalParticipant();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const copyMeetingCode = () => {
        navigator.clipboard.writeText(roomId);
        // You could add a toast here
    };

    return (
        <div className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-6">
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                currentAtmosphere={atmosphere}
                onAtmosphereChange={onAtmosphereChange}
            />

            {/* Left side: Meeting Info */}
            <div className="flex items-center gap-4 text-white">
                <div className="flex flex-col">
                    <span className="font-semibold text-sm">Meeting Room</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-mono bg-gray-800 px-2 py-1 rounded select-all cursor-pointer hover:bg-gray-700 transition-colors" title="Click to copy" onClick={copyMeetingCode}>
                            {roomId}
                        </span>
                    </div>
                </div>
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

                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-3 text-gray-400 hover:text-white transition-colors"
                >
                    <Settings size={20} />
                </button>
            </div>
        </div>
    );
}
