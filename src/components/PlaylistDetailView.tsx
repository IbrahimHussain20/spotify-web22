'use client';

import React from 'react';
import { Playlist, Track } from '@/types';
import { ArrowLeftIcon, HeartIcon, MoreVerticalIcon, PlayIcon, ShuffleIcon } from './Icons';
import { TrackRow } from './TrackRow';

interface PlaylistDetailViewProps {
  playlist: Playlist;
  currentTrackId?: string;
  likedTrackIds: Set<string>;
  onBack: () => void;
  onPlayTrack: (track: Track, newQueue?: Track[]) => void;
  onPlayAll: (tracks: Track[], shuffle?: boolean) => void;
  onToggleLike: (track: Track) => void;
  onOpenTrackMenu: (track: Track) => void;
  onDeletePlaylist?: (playlistId: string) => void;
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlist,
  currentTrackId,
  likedTrackIds,
  onBack,
  onPlayTrack,
  onPlayAll,
  onToggleLike,
  onOpenTrackMenu,
  onDeletePlaylist,
}) => {
  const isLikedSongs = playlist.id === 'liked-songs';

  return (
    <div className="pb-28 text-white">
      {/* Top Bar with Back Navigation */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#121212]/90 backdrop-blur-md">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="p-1 -ml-1 text-white hover:text-neutral-300 transition active:scale-90"
        >
          <ArrowLeftIcon size={24} />
        </button>
        <span className="text-sm font-bold truncate max-w-[200px]">{playlist.name}</span>
        <div className="w-8" />
      </div>

      {/* Hero Banner */}
      <div className="px-5 pt-3 pb-6 flex flex-col items-center text-center">
        <div
          className={`w-44 h-44 rounded-xl shadow-2xl overflow-hidden mb-5 flex items-center justify-center ${
            isLikedSongs
              ? 'bg-gradient-to-br from-[#450af5] to-[#8e8ee5]'
              : 'bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10'
          }`}
        >
          {isLikedSongs ? (
            <HeartIcon size={64} filled={true} className="text-white" />
          ) : playlist.tracks[0]?.thumbnail ? (
            <img
              src={playlist.tracks[0].thumbnail}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl font-bold text-neutral-400">
              {playlist.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight">{playlist.name}</h1>
        {playlist.description && (
          <p className="text-xs text-neutral-400 mt-1 max-w-xs">{playlist.description}</p>
        )}
        <p className="text-xs text-neutral-400 mt-2 font-medium">
          {playlist.tracks.length} {playlist.tracks.length === 1 ? 'song' : 'songs'}
        </p>

        {/* Action Buttons: Play All & Shuffle */}
        <div className="flex items-center justify-between w-full mt-5 px-2">
          <button
            onClick={() => onPlayAll(playlist.tracks, true)}
            disabled={playlist.tracks.length === 0}
            aria-label="Shuffle play"
            className="p-3 text-neutral-300 hover:text-white disabled:opacity-40 transition active:scale-90"
          >
            <ShuffleIcon size={24} />
          </button>

          <button
            onClick={() => onPlayAll(playlist.tracks, false)}
            disabled={playlist.tracks.length === 0}
            aria-label="Play all"
            className="w-14 h-14 rounded-full bg-[#1DB954] hover:bg-[#1ed760] active:scale-95 disabled:opacity-40 text-black flex items-center justify-center shadow-xl transition"
          >
            <PlayIcon size={26} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Tracks List */}
      <div className="px-2 divide-y divide-white/5">
        {playlist.tracks.length === 0 ? (
          <div className="py-16 text-center text-neutral-400">
            <p className="text-sm font-semibold text-white">No songs in this playlist yet</p>
            <p className="text-xs text-neutral-500 mt-1">
              Search for your favorite tracks and add them here!
            </p>
          </div>
        ) : (
          playlist.tracks.map((track, idx) => (
            <TrackRow
              key={`${track.id}-${idx}`}
              track={track}
              index={idx}
              isPlayingTrack={track.id === currentTrackId}
              isLiked={likedTrackIds.has(track.id)}
              onPlay={(t) => onPlayTrack(t, playlist.tracks)}
              onToggleLike={onToggleLike}
              onOpenMenu={onOpenTrackMenu}
            />
          ))
        )}
      </div>

      {/* Optional Delete Playlist Button */}
      {!isLikedSongs && onDeletePlaylist && (
        <div className="p-6 text-center">
          <button
            onClick={() => onDeletePlaylist(playlist.id)}
            className="text-xs text-red-400 hover:text-red-300 font-semibold uppercase tracking-wider py-2 px-4 rounded-full bg-red-950/40 border border-red-800/30"
          >
            Delete playlist
          </button>
        </div>
      )}
    </div>
  );
};
