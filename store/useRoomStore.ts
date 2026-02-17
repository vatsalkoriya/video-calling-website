import { create } from 'zustand';

interface Participant {
    id: string;
    name: string;
    email: string;
}

interface Room {
    id: string;
    roomId: string;
    host: Participant;
    participants: Participant[];
    createdAt: Date;
    isActive: boolean;
}

interface Message {
    _id: string;
    roomId: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: Date;
}

interface RoomState {
    currentRoom: Room | null;
    messages: Message[];
    setCurrentRoom: (room: Room | null) => void;
    addMessage: (message: Message) => void;
    setMessages: (messages: Message[]) => void;
    clearRoom: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    currentRoom: null,
    messages: [],

    setCurrentRoom: (room) => {
        set({ currentRoom: room });
    },

    addMessage: (message) => {
        set((state) => ({
            messages: [...state.messages, message],
        }));
    },

    setMessages: (messages) => {
        set({ messages });
    },

    clearRoom: () => {
        set({ currentRoom: null, messages: [] });
    },
}));
