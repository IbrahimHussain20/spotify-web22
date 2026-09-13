'use client';

import React, { useState } from 'react';
import { BROWSE_CATEGORIES, searchCatalog } from '@/data/catalog';
import { Track } from '@/types';
import { SearchIcon, XIcon } from './Icons';
import { TrackRow } from './TrackRow';

interface SearchScreenProps {
  onPlayTrack: (track: Track, newQueue?: Track[]) => void;
  likedTrackIds: Set<string>;
  onToggleLike: (track: Track) => void;
  onOpenTrackMenu: (track: Track) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onPlayTrack,
  likedTrackIds,
  onToggleLike,
  onOpenTrackMenu,
}) => {
  const [query, setQuery] = useState('');

  const searchResults = query.trim() ? searchCatalog(query) : [];

  const handleCategoryClick = (categoryName: string) => {
    setQuery(categoryName);
  };

  return (
    <div className="pb-28 pt-4 px-4 space-y-5">
      <h1 className="text-2xl font-bold text-white tracking-tight">Search</h1>

      {/* Search Input Bar (Spotify Android Style) */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-neutral-800 pointer-events-none">
          <SearchIcon size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full pl-11 pr-10 py-3 rounded-lg bg-white text-black placeholder:text-neutral-500 font-medium text-sm focus:outline-none shadow-md"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 p-1 text-neutral-600 hover:text-black transition"
          >
            <XIcon size={18} />
          </button>
        )}
      </div>

      {/* Content: Search Results OR Browse Categories */}
      {query.trim() ? (
        <div>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-1">
            Top Results ({searchResults.length})
          </p>
          {searchResults.length === 0 ? (
            <div className="py-16 text-center text-neutral-400">
              <p className="text-base font-semibold text-white">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1 text-neutral-500">
                Please make sure your words are spelled correctly or try different keywords.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {searchResults.map((track, idx) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={idx}
                  isLiked={likedTrackIds.has(track.id)}
                  onPlay={(t) => onPlayTrack(t, searchResults)}
                  onToggleLike={onToggleLike}
                  onOpenMenu={onOpenTrackMenu}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-base font-bold text-white mb-3 tracking-tight">Browse All</h2>
          <div className="grid grid-cols-2 gap-3">
            {BROWSE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.searchQuery)}
                style={{ backgroundColor: cat.color }}
                className="relative h-24 rounded-lg p-3 overflow-hidden cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] transition select-none"
              >
                <span className="text-base font-bold text-white leading-tight block pr-8">
                  {cat.name}
                </span>
                <div className="absolute -bottom-1 -right-2 w-16 h-16 transform rotate-[25deg] shadow-lg rounded bg-black/20" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
