'use client';

import React, { useState } from 'react';
import { XIcon } from './Icons';

interface SettingsModalProps {
  isOpen: boolean;
  apiKey: string;
  onClose: () => void;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  apiKey,
  onClose,
  onSaveApiKey,
}) => {
  const [key, setKey] = useState(apiKey);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(key.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-[#282828] rounded-xl p-6 text-white shadow-2xl border border-white/10 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-lg font-bold">Settings</h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase">
              YouTube Data API Key (Optional)
            </label>
            <input
              type="text"
              placeholder="AIzaSy..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-3 py-2 bg-[#3e3e3e] text-white rounded-md text-sm border border-transparent focus:border-[#1DB954] focus:outline-none"
            />
            <p className="text-[11px] text-neutral-400 mt-1.5 leading-normal">
              An API key enables live YouTube search directly beyond our 40-song curated catalog.
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 text-xs text-neutral-400 space-y-1">
            <p className="font-semibold text-white">Spotify Mobile (Android Edition)</p>
            <p>Version 8.9.22 • Clean Native Mobile UI</p>
            <p>Built with Next.js, React & Tailwind CSS</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-neutral-300 hover:text-white rounded-full transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-[#1DB954] hover:bg-[#1ed760] text-black rounded-full transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
