'use client';

import {
    useParticipants,
    useTracks,
    VideoTrack,
    ParticipantTile,
    ParticipantContext,
    TrackRefContext
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useMemo } from 'react';

export default function VideoGrid() {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        {}
    );

    const gridClass = useMemo(() => {
        const count = tracks.length;
        if (count <= 1) return 'grid-cols-1 max-w-4xl mx-auto';
        if (count <= 2) return 'grid-cols-1 md:grid-cols-2';
        if (count <= 4) return 'grid-cols-2';
        if (count <= 6) return 'grid-cols-2 md:grid-cols-3';
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }, [tracks.length]);

    return (
        <div className="flex-1 p-4 bg-black overflow-y-auto min-h-0">
            <div className={`grid gap-4 h-full items-center justify-center ${gridClass}`}>
                {tracks.map((track) => (
                    <TrackRefContext.Provider value={track} key={`${track.participant.identity}-${track.source}`}>
                        <ParticipantTile
                            className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl relative border border-gray-800"
                        />
                    </TrackRefContext.Provider>
                ))}
            </div>
        </div>
    );
}
