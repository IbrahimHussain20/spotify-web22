'use client';

import React, { useState } from 'react';
import { Playlist, Track } from '@/types';
import { HeartIcon, PlusIcon } from './Icons';

interface LibraryScreenProps {
  playlists: Playlist[];
  likedTracks: Track[];
  onOpenPlaylist: (playlist: Playlist) => void;
  onOpenLikedSongs: () => void;
  onOpenCreatePlaylist: () => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  playlists,
  likedTracks,
  onOpenPlaylist,
  onOpenLikedSongs,
  onOpenCreatePlaylist,
}) => {
  const [filter, setFilter] = useState<'all' | 'playlists'>('all');

  return (
    <div className="pb-28 pt-4 px-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Your Library</h1>
        <button
          onClick={onOpenCreatePlaylist}
          aria-label="Create playlist"
          className="p-2 text-neutral-300 hover:text-white transition active:scale-90"
        >
          <PlusIcon size={24} />
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
            filter === 'all'
              ? 'bg-white text-black'
              : 'bg-[#282828] text-neutral-300 hover:bg-[#323232]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('playlists')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
            filter === 'playlists'
              ? 'bg-white text-black'
              : 'bg-[#282828] text-neutral-300 hover:bg-[#323232]'
          }`}
        >
          Playlists
        </button>
      </div>

      {/* Library Items */}
      <div className="space-y-1 pt-2">
        {/* Liked Songs Pinned Item */}
        <div
          onClick={onOpenLikedSongs}
          className="flex items-center gap-3.5 p-2 rounded-lg hover:bg-white/5 active:bg-white/10 cursor-pointer transition"
        >
          <div className="w-16 h-16 rounded-md bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center flex-shrink-0 shadow">
            <HeartIcon size={24} filled={true} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-white truncate">Liked Songs</h3>
            <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
              <span className="text-[#1DB954] font-medium">📌 Pinned</span>
              <span>•</span>
              <span>{likedTracks.length} songs</span>
            </p>
          </div>
        </div>

        {/* User Playlists */}
        {playlists.map((pl) => (
          <div
            key={pl.id}
            onClick={() => onOpenPlaylist(pl)}
            className="flex items-center gap-3.5 p-2 rounded-lg hover:bg-white/5 active:bg-white/10 cursor-pointer transition"
          >
            <div className="w-16 h-16 rounded-md bg-[#282828] flex items-center justify-center flex-shrink-0 text-xl font-bold text-neutral-400 shadow border border-white/5">
              {pl.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-white truncate">{pl.name}</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Playlist • {pl.tracks.length} songs
              </p>
            </div>
          </div>
        ))}

        {playlists.length === 0 && filter === 'playlists' && (
          <div className="text-center py-12">
            <p className="text-sm font-semibold text-white">No playlists yet</p>
            <p className="text-xs text-neutral-400 mt-1">Tap + to create your first playlist.</p>
          </div>
        )}
      </div>
    </div>
  );
};
