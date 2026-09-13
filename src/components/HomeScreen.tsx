'use client';

import React from 'react';
import { ALL_TRACKS, ARTIST_GROUPS, TRENDING_TRACKS } from '@/data/catalog';
import { Track } from '@/types';
import { HeartIcon, PlayIcon, SettingsIcon } from './Icons';

interface HomeScreenProps {
  onPlayTrack: (track: Track, newQueue?: Track[]) => void;
  onOpenLikedSongs: () => void;
  onOpenPlaylistByName: (name: string) => void;
  onOpenSettings: () => void;
  likedTrackIds: Set<string>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlayTrack,
  onOpenLikedSongs,
  onOpenPlaylistByName,
  onOpenSettings,
  likedTrackIds,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickPicks = [
    {
      title: 'Liked Songs',
      type: 'liked',
      thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=100&auto=format&fit=crop&q=80',
      action: onOpenLikedSongs,
      isLikedCard: true,
    },
    {
      title: 'Ed Sheeran',
      type: 'artist',
      thumbnail: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg',
      action: () => onOpenPlaylistByName('Ed Sheeran'),
    },
    {
      title: 'Taylor Swift',
      type: 'artist',
      thumbnail: 'https://i.ytimg.com/vi/e-ORhEE9VVg/hqdefault.jpg',
      action: () => onOpenPlaylistByName('Taylor Swift'),
    },
    {
      title: 'The Weeknd',
      type: 'artist',
      thumbnail: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg',
      action: () => onOpenPlaylistByName('The Weeknd'),
    },
    {
      title: 'Imagine Dragons',
      type: 'artist',
      thumbnail: 'https://i.ytimg.com/vi/7wtfhZwyrcc/hqdefault.jpg',
      action: () => onOpenPlaylistByName('Imagine Dragons'),
    },
    {
      title: 'Electronic Hits',
      type: 'genre',
      thumbnail: 'https://i.ytimg.com/vi/UceaB4D0jpo/hqdefault.jpg',
      action: () => onOpenPlaylistByName('Electronic Hits'),
    },
  ];

  return (
    <div className="pb-28 pt-4 px-4 space-y-7">
      {/* Top App Bar with Greeting */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">{getGreeting()}</h1>
        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="p-2 text-neutral-300 hover:text-white transition active:scale-90"
        >
          <SettingsIcon size={22} />
        </button>
      </div>

      {/* Quick Access 2-Column Grid (Android Spotify Style) */}
      <div className="grid grid-cols-2 gap-2.5">
        {quickPicks.map((pick, i) => (
          <div
            key={i}
            onClick={pick.action}
            className="flex items-center bg-[#282828] hover:bg-[#323232] active:bg-[#3c3c3c] transition-colors rounded-md overflow-hidden cursor-pointer shadow-md group border border-white/5"
          >
            {pick.isLikedCard ? (
              <div className="w-14 h-14 bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center flex-shrink-0">
                <HeartIcon size={20} filled={true} className="text-white" />
              </div>
            ) : (
              <img
                src={pick.thumbnail}
                alt={pick.title}
                className="w-14 h-14 object-cover flex-shrink-0 bg-neutral-800"
              />
            )}
            <span className="text-xs font-bold text-white px-2.5 line-clamp-2 leading-tight">
              {pick.title}
            </span>
          </div>
        ))}
      </div>

      {/* Trending Now Section */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-lg font-bold text-white tracking-tight">Trending Now</h2>
        </div>
        <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          {TRENDING_TRACKS.map((track) => (
            <div
              key={track.id}
              onClick={() => onPlayTrack(track, TRENDING_TRACKS)}
              className="flex-shrink-0 w-36 bg-[#181818] hover:bg-[#222222] p-3 rounded-lg cursor-pointer transition shadow-md border border-white/5 group"
            >
              <div className="relative aspect-square w-full rounded-md overflow-hidden mb-2.5 bg-neutral-800 shadow">
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayTrack(track, TRENDING_TRACKS);
                  }}
                  className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-lg opacity-90 group-hover:scale-110 active:scale-95 transition"
                >
                  <PlayIcon size={18} className="ml-0.5" />
                </button>
              </div>
              <h3 className="text-xs font-bold text-white truncate">{track.title}</h3>
              <p className="text-[11px] text-neutral-400 truncate mt-0.5">{track.artist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Artists */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight mb-3.5">Popular Artists</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          {ARTIST_GROUPS.map((artist, idx) => (
            <div
              key={idx}
              onClick={() => onOpenPlaylistByName(artist.name)}
              className="flex-shrink-0 w-28 text-center cursor-pointer group"
            >
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden shadow-lg border-2 border-transparent group-hover:border-[#1DB954] transition mb-2 bg-neutral-800">
                <img
                  src={artist.tracks[0]?.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200'}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <p className="text-xs font-bold text-white truncate">{artist.name}</p>
              <p className="text-[11px] text-neutral-400">Artist</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended For You */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight mb-3">Made For You</h2>
        <div className="space-y-1">
          {ALL_TRACKS.slice(10, 18).map((track, idx) => (
            <div
              key={track.id}
              onClick={() => onPlayTrack(track, ALL_TRACKS)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 active:bg-white/10 cursor-pointer transition"
            >
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-12 h-12 rounded object-cover flex-shrink-0 bg-neutral-800"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-white truncate">{track.title}</h4>
                <p className="text-xs text-neutral-400 truncate mt-0.5">{track.artist}</p>
              </div>
              <div className="text-neutral-500 hover:text-white p-2">
                <PlayIcon size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
