'use client';

import { X, Sparkles, Palette, Monitor, Shield, Zap } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentAtmosphere: string;
    onAtmosphereChange: (atmosphere: string) => void;
}

export default function SettingsModal({
    isOpen,
    onClose,
    currentAtmosphere,
    onAtmosphereChange
}: SettingsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                            <Zap className="text-blue-500" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Meeting Settings</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Unique Functionality: Meeting Vibe */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            <Palette size={16} />
                            <span>Unique: Meeting Atmosphere</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {['Classic', 'Midnight', 'Aurora', 'Sunset'].map((vibe) => (
                                <button
                                    key={vibe}
                                    onClick={() => onAtmosphereChange(vibe)}
                                    className={`p-4 rounded-xl border transition-all text-left flex flex-col gap-1 group ${currentAtmosphere === vibe
                                            ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                            : 'border-gray-800 bg-gray-800/50 hover:bg-gray-800 hover:border-gray-600'
                                        }`}
                                >
                                    <span className={`font-medium transition-colors ${currentAtmosphere === vibe ? 'text-blue-400' : 'text-white'
                                        }`}>{vibe}</span>
                                    <span className="text-xs text-gray-500">Change room's visual feel</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            <Monitor size={16} />
                            <span>Video & Audio</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-800 bg-gray-800/30">
                                <div>
                                    <p className="text-white font-medium">Noise Suppression</p>
                                    <p className="text-xs text-gray-500">Filter out background noise</p>
                                </div>
                                <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1">
                                    <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-800 bg-gray-800/30">
                                <div>
                                    <p className="text-white font-medium">Auto-Focus</p>
                                    <p className="text-xs text-gray-500">Keep you in the center</p>
                                </div>
                                <div className="w-12 h-6 bg-gray-700 rounded-full flex items-center px-1">
                                    <div className="w-4 h-4 bg-gray-400 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            <Sparkles size={16} />
                            <span>AI Enhancements</span>
                        </div>
                        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-4">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Shield className="text-blue-400" size={20} />
                            </div>
                            <div>
                                <p className="text-white font-medium">Privacy Shield</p>
                                <p className="text-xs text-gray-400 mt-1">Automatically blurs background when someone walks behind you.</p>
                                <button className="mt-3 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">ENABLE BETA</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
