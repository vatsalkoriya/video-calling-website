import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
    user?: JWTPayload;
}

/**
 * Middleware to authenticate API requests
 * Returns user data if authenticated, otherwise returns 401 error
 */
export async function authenticate(request: NextRequest): Promise<{ user: JWTPayload } | NextResponse> {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
        return NextResponse.json(
            { success: false, error: 'No token provided' },
            { status: 401 }
        );
    }

    const user = verifyToken(token);

    if (!user) {
        return NextResponse.json(
            { success: false, error: 'Invalid or expired token' },
            { status: 401 }
        );
    }

    return { user };
}
