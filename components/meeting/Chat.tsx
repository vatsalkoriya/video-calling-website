'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat, useLocalParticipant } from '@livekit/components-react';
import { Send, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface ChatProps {
    roomId: string;
}

export default function Chat({ roomId }: ChatProps) {
    const { chatMessages, send } = useChat();
    const { localParticipant } = useLocalParticipant();
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);

    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch chat history from MongoDB on join
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(`/api/messages?roomId=${roomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setHistory(data.data.messages);
                }
            } catch (error) {
                console.error('Failed to fetch chat history:', error);
            }
        };

        if (token) fetchHistory();
    }, [roomId, token]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages, history]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !send) return;

        try {
            // Send via LiveKit (Real-time)
            await send(message);

            // Persist to MongoDB
            await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    roomId,
                    message,
                }),
            });

            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    // Combine history and real-time messages
    // In a production app, you might want to deduplicate or merge them carefully
    // For now, we'll show history then LiveKit messages
    const allMessages = [...history.map(m => ({
        id: m._id,
        message: m.message,
        from: { identity: m.senderId, name: m.senderName },
        timestamp: new Date(m.timestamp).getTime()
    })), ...chatMessages];

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 w-80">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white">In-call Messages</h3>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin overflow-x-hidden"
            >
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">
                    Messages can be seen by everyone in the call
                </p>

                {allMessages.map((msg, idx) => {
                    const isMe = msg.from?.identity === user?.id;
                    return (
                        <div key={msg.id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                {!isMe && <span className="text-[10px] font-medium text-gray-500">{msg.from?.name || 'Unknown'}</span>}
                            </div>
                            <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${isMe
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
                                }`}>
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Send a message..."
                        className="w-full pl-4 pr-10 py-2 bg-gray-100 dark:bg-gray-900 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:text-blue-700"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}
