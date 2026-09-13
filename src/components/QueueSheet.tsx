'use client';

import React from 'react';
import { Track } from '@/types';
import { TrackRow } from './TrackRow';
import { XIcon } from './Icons';

interface QueueSheetProps {
  isOpen: boolean;
  currentTrack: Track | null;
  queue: Track[];
  likedTrackIds: Set<string>;
  onClose: () => void;
  onPlayTrack: (track: Track) => void;
  onToggleLike: (track: Track) => void;
  onOpenTrackMenu: (track: Track) => void;
  onClearQueue: () => void;
}

export const QueueSheet: React.FC<QueueSheetProps> = ({
  isOpen,
  currentTrack,
  queue,
  likedTrackIds,
  onClose,
  onPlayTrack,
  onToggleLike,
  onOpenTrackMenu,
  onClearQueue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#181818] rounded-t-2xl p-5 text-white shadow-2xl border-t border-white/10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h2 className="text-lg font-bold">Play Queue</h2>
          <div className="flex items-center gap-2">
            {queue.length > 0 && (
              <button
                onClick={onClearQueue}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-800"
              >
                Clear
              </button>
            )}
            <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
              <XIcon size={22} />
            </button>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto flex-1 py-3 divide-y divide-white/5 space-y-3">
          {/* Now Playing Section */}
          {currentTrack && (
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 px-2">
                Now Playing
              </p>
              <TrackRow
                track={currentTrack}
                isPlayingTrack={true}
                isLiked={likedTrackIds.has(currentTrack.id)}
                onPlay={() => {}}
                onToggleLike={onToggleLike}
                onOpenMenu={onOpenTrackMenu}
              />
            </div>
          )}

          {/* Next in Queue */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-2">
              Next In Queue ({queue.length})
            </p>
            {queue.length === 0 ? (
              <p className="text-sm text-neutral-500 py-6 text-center">
                Your queue is currently empty.
              </p>
            ) : (
              <div className="space-y-1">
                {queue.map((track, idx) => (
                  <TrackRow
                    key={`${track.id}-${idx}`}
                    track={track}
                    index={idx}
                    isLiked={likedTrackIds.has(track.id)}
                    onPlay={onPlayTrack}
                    onToggleLike={onToggleLike}
                    onOpenMenu={onOpenTrackMenu}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
