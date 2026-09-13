'use client';

import React from 'react';
import { Track } from '@/types';
import { HeartIcon, PauseIcon, PlayIcon } from './Icons';

interface MiniPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLiked: boolean;
  onTogglePlay: () => void;
  onToggleLike: (track: Track) => void;
  onOpenFullScreen: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  isLiked,
  onTogglePlay,
  onToggleLike,
  onOpenFullScreen,
}) => {
  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="px-2 pb-1.5 pt-1 w-full max-w-md mx-auto">
      <div
        onClick={onOpenFullScreen}
        className="relative flex items-center justify-between bg-[#242424] hover:bg-[#2a2a2a] active:bg-[#303030] transition-colors rounded-lg px-3 py-2 cursor-pointer shadow-xl border border-white/5 overflow-hidden"
      >
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
          <img
            src={currentTrack.thumbnail}
            alt={currentTrack.title}
            className="w-11 h-11 rounded-md object-cover flex-shrink-0 bg-neutral-800 shadow"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=60';
            }}
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-white text-sm font-semibold truncate leading-tight tracking-tight">
              {currentTrack.title}
            </h4>
            <p className="text-neutral-400 text-xs truncate mt-0.5">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleLike(currentTrack)}
            aria-label="Save to Liked Songs"
            className="p-2 text-neutral-400 hover:text-white transition active:scale-90"
          >
            <HeartIcon size={20} filled={isLiked} />
          </button>

          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="p-2 text-white hover:scale-105 active:scale-95 transition"
          >
            {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
          </button>
        </div>

        {/* Progress bar line at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-neutral-700/60">
          <div
            className="h-full bg-[#1DB954] transition-all duration-200 ease-linear rounded-r-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
