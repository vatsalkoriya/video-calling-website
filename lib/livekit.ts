import { AccessToken } from 'livekit-server-sdk';

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || '';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || '';

if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    console.warn('⚠️ LiveKit API credentials not configured. Please set LIVEKIT_API_KEY and LIVEKIT_API_SECRET in .env.local');
}

export interface LiveKitTokenOptions {
    roomName: string;
    participantName: string;
    participantIdentity: string;
    metadata?: string;
}

/**
 * Generate a LiveKit access token for a participant
 */
export async function generateLiveKitToken(options: LiveKitTokenOptions): Promise<string> {
    const { roomName, participantName, participantIdentity, metadata } = options;

    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: participantIdentity,
        name: participantName,
        metadata,
    });

    // Grant permissions
    token.addGrant({
        room: roomName,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true, // For chat via DataChannel
    });

    return await token.toJwt();
}

/**
 * Generate a LiveKit token with host permissions
 */
export async function generateHostToken(options: LiveKitTokenOptions): Promise<string> {
    const { roomName, participantName, participantIdentity, metadata } = options;

    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: participantIdentity,
        name: participantName,
        metadata,
    });

    // Grant host permissions
    token.addGrant({
        room: roomName,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
        roomAdmin: true, // Admin permissions for host controls
    });

    return await token.toJwt();
}
