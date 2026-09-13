'use client';

import React from 'react';
import { Track } from '@/types';
import { HeartIcon, ListMusicIcon, PlayIcon, PlusIcon, XIcon } from './Icons';

interface TrackMenuSheetProps {
  track: Track | null;
  isOpen: boolean;
  isLiked: boolean;
  onClose: () => void;
  onPlayNow: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
  onAddToPlaylist: (track: Track) => void;
  onToggleLike: (track: Track) => void;
}

export const TrackMenuSheet: React.FC<TrackMenuSheetProps> = ({
  track,
  isOpen,
  isLiked,
  onClose,
  onPlayNow,
  onAddToQueue,
  onAddToPlaylist,
  onToggleLike,
}) => {
  if (!isOpen || !track) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#242424] rounded-t-2xl p-4 text-white shadow-2xl border-t border-white/10 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-neutral-600 rounded-full mx-auto mb-4" />

        {/* Track header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-12 h-12 rounded object-cover shadow"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold truncate text-white">{track.title}</h3>
            <p className="text-xs text-neutral-400 truncate mt-0.5">{track.artist}</p>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white">
            <XIcon size={20} />
          </button>
        </div>

        {/* Menu items */}
        <div className="py-2 space-y-1">
          <button
            onClick={() => {
              onPlayNow(track);
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3 py-3 rounded-lg hover:bg-white/5 active:bg-white/10 text-left text-sm font-medium"
          >
            <PlayIcon size={20} className="text-neutral-300" />
            <span>Play track</span>
          </button>

          <button
            onClick={() => {
              onToggleLike(track);
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3 py-3 rounded-lg hover:bg-white/5 active:bg-white/10 text-left text-sm font-medium"
          >
            <HeartIcon size={20} filled={isLiked} className={isLiked ? 'text-[#1DB954]' : 'text-neutral-300'} />
            <span>{isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}</span>
          </button>

          <button
            onClick={() => {
              onAddToQueue(track);
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3 py-3 rounded-lg hover:bg-white/5 active:bg-white/10 text-left text-sm font-medium"
          >
            <ListMusicIcon size={20} className="text-neutral-300" />
            <span>Add to queue</span>
          </button>

          <button
            onClick={() => {
              onAddToPlaylist(track);
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3 py-3 rounded-lg hover:bg-white/5 active:bg-white/10 text-left text-sm font-medium"
          >
            <PlusIcon size={20} className="text-neutral-300" />
            <span>Add to playlist</span>
          </button>
        </div>
      </div>
    </div>
  );
};
