'use client';

import React, { useState } from 'react';
import { Playlist, Track } from '@/types';
import { CheckIcon, PlusIcon, XIcon } from './Icons';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), description.trim());
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-[#282828] rounded-xl p-6 text-white shadow-2xl border border-white/10 animate-in zoom-in-95">
        <h3 className="text-lg font-bold mb-4">Create Playlist</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase">
              Playlist Name
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Morning Acoustic Vibes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#3e3e3e] text-white rounded-md text-sm border border-transparent focus:border-[#1DB954] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase">
              Description (optional)
            </label>
            <textarea
              rows={2}
              placeholder="Give your playlist a cool description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#3e3e3e] text-white rounded-md text-sm border border-transparent focus:border-[#1DB954] focus:outline-none resize-none"
            />
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
              disabled={!name.trim()}
              className="px-5 py-2 text-sm font-semibold bg-[#1DB954] hover:bg-[#1ed760] active:scale-95 text-black rounded-full transition disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddToPlaylistModalProps {
  isOpen: boolean;
  track: Track | null;
  playlists: Playlist[];
  onClose: () => void;
  onToggleTrackInPlaylist: (playlistId: string, track: Track) => void;
  onOpenCreatePlaylist: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  track,
  playlists,
  onClose,
  onToggleTrackInPlaylist,
  onOpenCreatePlaylist,
}) => {
  if (!isOpen || !track) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-md bg-[#242424] rounded-t-2xl p-5 text-white shadow-2xl border-t border-white/10 max-h-[75vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold">Add to playlist</h3>
            <p className="text-xs text-neutral-400 truncate max-w-[260px]">{track.title}</p>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
            <XIcon size={20} />
          </button>
        </div>

        <div className="py-3">
          <button
            onClick={() => {
              onClose();
              onOpenCreatePlaylist();
            }}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-semibold text-[#1DB954] transition"
          >
            <div className="w-9 h-9 rounded bg-[#1DB954]/20 flex items-center justify-center">
              <PlusIcon size={20} className="text-[#1DB954]" />
            </div>
            <span>New playlist</span>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-white/5">
          {playlists.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-6">No custom playlists yet.</p>
          ) : (
            playlists.map((pl) => {
              const isAdded = pl.tracks.some((t) => t.id === track.id);
              return (
                <div
                  key={pl.id}
                  onClick={() => onToggleTrackInPlaylist(pl.id, track)}
                  className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-white/5 cursor-pointer transition"
                >
                  <div>
                    <h4 className="text-sm font-medium text-white">{pl.name}</h4>
                    <p className="text-xs text-neutral-400">{pl.tracks.length} tracks</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                      isAdded
                        ? 'bg-[#1DB954] border-[#1DB954] text-black font-bold'
                        : 'border-neutral-500'
                    }`}
                  >
                    {isAdded && '✓'}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
