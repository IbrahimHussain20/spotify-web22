'use client';

import React from 'react';
import { Track } from '@/types';
import { HeartIcon, MoreVerticalIcon } from './Icons';

interface TrackRowProps {
  track: Track;
  index?: number;
  isPlayingTrack?: boolean;
  isLiked?: boolean;
  onPlay: (track: Track) => void;
  onToggleLike: (track: Track) => void;
  onOpenMenu: (track: Track) => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  isPlayingTrack = false,
  isLiked = false,
  onPlay,
  onToggleLike,
  onOpenMenu,
}) => {
  return (
    <div
      onClick={() => onPlay(track)}
      className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer group select-none"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
        {index !== undefined && (
          <span
            className={`w-5 text-center text-xs font-semibold flex-shrink-0 ${
              isPlayingTrack ? 'text-[#1DB954]' : 'text-neutral-500'
            }`}
          >
            {isPlayingTrack ? (
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-pulse" />
            ) : (
              index + 1
            )}
          </span>
        )}

        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-11 h-11 rounded object-cover flex-shrink-0 bg-neutral-800 shadow-sm"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=60';
          }}
        />

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-medium truncate leading-tight ${
              isPlayingTrack ? 'text-[#1DB954]' : 'text-white'
            }`}
          >
            {track.title}
          </p>
          <p className="text-xs text-neutral-400 truncate mt-0.5">{track.artist}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onToggleLike(track)}
          aria-label="Toggle like"
          className="p-1.5 text-neutral-400 hover:text-white active:scale-90 transition"
        >
          <HeartIcon size={18} filled={isLiked} />
        </button>

        <button
          onClick={() => onOpenMenu(track)}
          aria-label="Track options"
          className="p-1.5 text-neutral-400 hover:text-white active:scale-90 transition"
        >
          <MoreVerticalIcon size={18} />
        </button>
      </div>
    </div>
  );
};
