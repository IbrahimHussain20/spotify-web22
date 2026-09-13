'use client';

import React from 'react';
import { ActiveTab } from '@/types';
import { HomeIcon, LibraryIcon, SearchIcon } from './Icons';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="w-full bg-[#121212]/95 backdrop-blur-lg border-t border-white/5 py-2 px-6 flex items-center justify-around select-none">
      <button
        onClick={() => onSelectTab('home')}
        className="flex flex-col items-center gap-1 text-xs transition active:scale-90"
      >
        <HomeIcon
          size={24}
          filled={activeTab === 'home'}
          className={activeTab === 'home' ? 'text-white' : 'text-neutral-400'}
        />
        <span
          className={`font-semibold tracking-tight ${
            activeTab === 'home' ? 'text-white' : 'text-neutral-400'
          }`}
        >
          Home
        </span>
      </button>

      <button
        onClick={() => onSelectTab('search')}
        className="flex flex-col items-center gap-1 text-xs transition active:scale-90"
      >
        <SearchIcon
          size={24}
          className={activeTab === 'search' ? 'text-white' : 'text-neutral-400'}
        />
        <span
          className={`font-semibold tracking-tight ${
            activeTab === 'search' ? 'text-white' : 'text-neutral-400'
          }`}
        >
          Search
        </span>
      </button>

      <button
        onClick={() => onSelectTab('library')}
        className="flex flex-col items-center gap-1 text-xs transition active:scale-90"
      >
        <LibraryIcon
          size={24}
          filled={activeTab === 'library'}
          className={activeTab === 'library' ? 'text-white' : 'text-neutral-400'}
        />
        <span
          className={`font-semibold tracking-tight ${
            activeTab === 'library' ? 'text-white' : 'text-neutral-400'
          }`}
        >
          Your Library
        </span>
      </button>
    </nav>
  );
};
