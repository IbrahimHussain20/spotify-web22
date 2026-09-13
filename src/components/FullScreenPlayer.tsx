'use client';

import React, { useState } from 'react';
import { RepeatMode, Track } from '@/types';
import {
  ChevronDownIcon,
  HeartIcon,
  ListMusicIcon,
  MoreVerticalIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  RepeatOneIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume2Icon,
  VolumeXIcon,
} from './Icons';

interface FullScreenPlayerProps {
  isOpen: boolean;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isLiked: boolean;
  sourceName?: string;
  onClose: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLike: (track: Track) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onOpenQueue: () => void;
  onOpenTrackMenu: (track: Track) => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({
  isOpen,
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  repeatMode,
  isLiked,
  sourceName = 'Spotify Catalog',
  onClose,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
  onVolumeChange,
  onToggleMute,
  onOpenQueue,
  onOpenTrackMenu,
}) => {
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);

  if (!isOpen || !currentTrack) return null;

  const effectiveDuration = duration > 0 ? duration : currentTrack.durationSeconds || 180;
  const currentDisplayTime = isScrubbing ? scrubValue : currentTime;
  const progressPercent = Math.min(100, Math.max(0, (currentDisplayTime / effectiveDuration) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#2b2b2b] via-[#121212] to-[#000000] text-white flex flex-col justify-between p-6 sm:p-8 animate-in slide-in-from-bottom duration-300 max-w-md mx-auto overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onClose}
          aria-label="Collapse player"
          className="p-2 -ml-2 text-neutral-300 hover:text-white transition"
        >
          <ChevronDownIcon size={28} />
        </button>
        <div className="text-center px-4">
          <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
            Playing from
          </p>
          <p className="text-xs text-neutral-100 font-medium truncate max-w-[200px]">
            {sourceName}
          </p>
        </div>
        <button
          onClick={() => onOpenTrackMenu(currentTrack)}
          aria-label="Track options"
          className="p-2 -mr-2 text-neutral-300 hover:text-white transition"
        >
          <MoreVerticalIcon size={22} />
        </button>
      </div>

      {/* Large Artwork */}
      <div className="my-auto py-6 flex items-center justify-center">
        <div className="relative w-full aspect-square max-w-[320px] rounded-xl overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-white/10 bg-neutral-900">
          <img
            src={currentTrack.thumbnail}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80';
            }}
          />
        </div>
      </div>

      {/* Track Details & Heart */}
      <div className="flex items-center justify-between mb-4">
        <div className="min-w-0 flex-1 pr-4">
          <h2 className="text-xl font-bold text-white tracking-tight truncate leading-tight">
            {currentTrack.title}
          </h2>
          <p className="text-neutral-400 text-sm font-medium truncate mt-1">
            {currentTrack.artist}
          </p>
        </div>
        <button
          onClick={() => onToggleLike(currentTrack)}
          aria-label="Like track"
          className="p-2 text-neutral-400 hover:text-white active:scale-90 transition flex-shrink-0"
        >
          <HeartIcon size={26} filled={isLiked} />
        </button>
      </div>

      {/* Scrub Bar Slider */}
      <div className="mb-4">
        <div className="relative flex items-center group py-2">
          <input
            type="range"
            min={0}
            max={effectiveDuration}
            value={currentDisplayTime}
            onMouseDown={() => setIsScrubbing(true)}
            onTouchStart={() => setIsScrubbing(true)}
            onChange={(e) => setScrubValue(Number(e.target.value))}
            onMouseUp={() => {
              setIsScrubbing(false);
              onSeek(scrubValue);
            }}
            onTouchEnd={() => {
              setIsScrubbing(false);
              onSeek(scrubValue);
            }}
            aria-label="Seek track position"
            className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#1DB954] focus:outline-none focus:ring-0"
          />
        </div>
        <div className="flex justify-between text-[11px] font-medium text-neutral-400">
          <span>{formatTime(currentDisplayTime)}</span>
          <span>{formatTime(effectiveDuration)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between mb-6 px-1">
        {/* Shuffle */}
        <button
          onClick={onToggleShuffle}
          aria-label="Shuffle"
          className={`p-2 transition active:scale-90 ${
            isShuffle ? 'text-[#1DB954]' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ShuffleIcon size={22} />
        </button>

        {/* Previous */}
        <button
          onClick={onPrevious}
          aria-label="Previous track"
          className="p-2 text-neutral-200 hover:text-white active:scale-90 transition"
        >
          <SkipBackIcon size={30} />
        </button>

        {/* Big Play / Pause */}
        <button
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition"
        >
          {isPlaying ? <PauseIcon size={32} /> : <PlayIcon size={32} className="ml-1" />}
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          aria-label="Next track"
          className="p-2 text-neutral-200 hover:text-white active:scale-90 transition"
        >
          <SkipForwardIcon size={30} />
        </button>

        {/* Repeat */}
        <button
          onClick={onToggleRepeat}
          aria-label="Repeat"
          className={`p-2 transition active:scale-90 ${
            repeatMode !== 'off' ? 'text-[#1DB954]' : 'text-neutral-400 hover:text-white'
          }`}
        >
          {repeatMode === 'one' ? <RepeatOneIcon size={22} /> : <RepeatIcon size={22} />}
        </button>
      </div>

      {/* Volume & Bottom Utilities */}
      <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/5">
        <div className="flex items-center gap-2 flex-1 max-w-[200px]">
          <button
            onClick={onToggleMute}
            aria-label="Mute toggle"
            className="text-neutral-400 hover:text-white transition"
          >
            {isMuted || volume === 0 ? <VolumeXIcon size={18} /> : <Volume2Icon size={18} />}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            aria-label="Volume slider"
            className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#1DB954] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQueue}
            aria-label="Show Queue"
            className="p-2 text-neutral-400 hover:text-white active:scale-90 transition"
          >
            <ListMusicIcon size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};
