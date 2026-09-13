'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ALL_TRACKS, ARTIST_GROUPS, TRENDING_TRACKS } from '@/data/catalog';
import { ActiveTab, Playlist, RepeatMode, Track } from '@/types';
import { AudioPlayer } from '@/components/AudioPlayer';
import { BottomNav } from '@/components/BottomNav';
import { FullScreenPlayer } from '@/components/FullScreenPlayer';
import { HomeScreen } from '@/components/HomeScreen';
import { LibraryScreen } from '@/components/LibraryScreen';
import { MiniPlayer } from '@/components/MiniPlayer';
import { AddToPlaylistModal, CreatePlaylistModal } from '@/components/PlaylistModals';
import { PlaylistDetailView } from '@/components/PlaylistDetailView';
import { QueueSheet } from '@/components/QueueSheet';
import { SearchScreen } from '@/components/SearchScreen';
import { SettingsModal } from '@/components/SettingsModal';
import { TrackMenuSheet } from '@/components/TrackMenuSheet';

export default function SpotifyApp() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Playback State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(ALL_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(ALL_TRACKS[0].durationSeconds);
  const [seekTime, setSeekTime] = useState<number | null>(null);

  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');

  const [queue, setQueue] = useState<Track[]>(ALL_TRACKS.slice(1, 15));
  const [history, setHistory] = useState<Track[]>([]);

  // User Data State (with localStorage persistence)
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [apiKey, setApiKey] = useState<string>('');

  // Modals & Sheets State
  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [menuTrack, setMenuTrack] = useState<Track | null>(null);
  const [addToPlaylistTrack, setAddToPlaylistTrack] = useState<Track | null>(null);

  // Toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Load from local storage
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem('spotify_liked_tracks');
      if (savedLikes) {
        setLikedTracks(JSON.parse(savedLikes));
      } else {
        // Pre-populate with 4 favorites
        setLikedTracks(ALL_TRACKS.slice(0, 4));
      }

      const savedPlaylists = localStorage.getItem('spotify_custom_playlists');
      if (savedPlaylists) {
        setPlaylists(JSON.parse(savedPlaylists));
      } else {
        setPlaylists([
          {
            id: 'demo-1',
            name: 'Late Night Chill',
            description: 'Relaxing sounds for after hours',
            tracks: [ALL_TRACKS[8], ALL_TRACKS[9], ALL_TRACKS[15], ALL_TRACKS[33]],
            createdAt: Date.now(),
          },
        ]);
      }

      const savedKey = localStorage.getItem('spotify_yt_api_key');
      if (savedKey) setApiKey(savedKey);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save likes
  const saveLikedTracks = (newLikes: Track[]) => {
    setLikedTracks(newLikes);
    try {
      localStorage.setItem('spotify_liked_tracks', JSON.stringify(newLikes));
    } catch (e) {}
  };

  // Save playlists
  const savePlaylists = (newPlaylists: Playlist[]) => {
    setPlaylists(newPlaylists);
    try {
      localStorage.setItem('spotify_custom_playlists', JSON.stringify(newPlaylists));
    } catch (e) {}
  };

  const likedTrackIds = useMemo(() => new Set(likedTracks.map((t) => t.id)), [likedTracks]);

  // Toggle Like
  const handleToggleLike = (track: Track) => {
    if (likedTrackIds.has(track.id)) {
      const updated = likedTracks.filter((t) => t.id !== track.id);
      saveLikedTracks(updated);
      showToast('Removed from Liked Songs');
    } else {
      const updated = [track, ...likedTracks];
      saveLikedTracks(updated);
      showToast('Added to Liked Songs');
    }
  };

  // Play a specific track
  const handlePlayTrack = (track: Track, newQueue?: Track[]) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
      return;
    }

    if (currentTrack) {
      setHistory((prev) => [currentTrack, ...prev.slice(0, 19)]);
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(track.durationSeconds || 180);

    if (newQueue) {
      const filtered = newQueue.filter((t) => t.id !== track.id);
      setQueue(filtered);
    }
  };

  // Play next track in queue
  const handleNext = () => {
    if (queue.length === 0) {
      if (repeatMode === 'all') {
        const resetQueue = ALL_TRACKS.filter((t) => t.id !== currentTrack?.id);
        if (resetQueue.length > 0) {
          handlePlayTrack(resetQueue[0], resetQueue);
        }
      } else {
        setIsPlaying(false);
      }
      return;
    }

    let nextTrack: Track;
    let remainingQueue: Track[];

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      nextTrack = queue[randomIndex];
      remainingQueue = queue.filter((_, idx) => idx !== randomIndex);
    } else {
      nextTrack = queue[0];
      remainingQueue = queue.slice(1);
    }

    if (currentTrack) {
      setHistory((prev) => [currentTrack, ...prev.slice(0, 19)]);
    }

    setCurrentTrack(nextTrack);
    setQueue(remainingQueue);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(nextTrack.durationSeconds || 180);
  };

  // Previous track
  const handlePrevious = () => {
    if (currentTime > 3) {
      setSeekTime(0);
      setCurrentTime(0);
      return;
    }

    if (history.length > 0) {
      const prevTrack = history[0];
      setHistory((prev) => prev.slice(1));
      if (currentTrack) {
        setQueue((prev) => [currentTrack, ...prev]);
      }
      setCurrentTrack(prevTrack);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(prevTrack.durationSeconds || 180);
    } else {
      setSeekTime(0);
      setCurrentTime(0);
    }
  };

  // Play all tracks from playlist or collection
  const handlePlayAll = (tracks: Track[], shuffle: boolean = false) => {
    if (tracks.length === 0) return;
    let list = [...tracks];
    if (shuffle) {
      list = list.sort(() => Math.random() - 0.5);
    }
    const first = list[0];
    const rest = list.slice(1);
    handlePlayTrack(first, rest);
  };

  // Playlist Management
  const handleCreatePlaylist = (name: string, description: string) => {
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      name,
      description,
      tracks: [],
      createdAt: Date.now(),
    };
    const updated = [newPl, ...playlists];
    savePlaylists(updated);
    showToast(`Created playlist "${name}"`);
    setSelectedPlaylist(newPl);
  };

  const handleToggleTrackInPlaylist = (playlistId: string, track: Track) => {
    const updated = playlists.map((pl) => {
      if (pl.id !== playlistId) return pl;
      const exists = pl.tracks.some((t) => t.id === track.id);
      if (exists) {
        showToast(`Removed from "${pl.name}"`);
        return { ...pl, tracks: pl.tracks.filter((t) => t.id !== track.id) };
      } else {
        showToast(`Added to "${pl.name}"`);
        return { ...pl, tracks: [...pl.tracks, track] };
      }
    });
    savePlaylists(updated);
    if (selectedPlaylist?.id === playlistId) {
      const currentUpdated = updated.find((p) => p.id === playlistId);
      if (currentUpdated) setSelectedPlaylist(currentUpdated);
    }
  };

  const handleDeletePlaylist = (playlistId: string) => {
    const updated = playlists.filter((pl) => pl.id !== playlistId);
    savePlaylists(updated);
    showToast('Playlist deleted');
    setSelectedPlaylist(null);
  };

  // Navigation handlers
  const openLikedSongsView = () => {
    setSelectedPlaylist({
      id: 'liked-songs',
      name: 'Liked Songs',
      description: 'Your favorite tracks in one collection',
      tracks: likedTracks,
      createdAt: 0,
    });
  };

  const openPlaylistByName = (name: string) => {
    const group = ARTIST_GROUPS.find((g) => g.name.toLowerCase() === name.toLowerCase());
    if (group) {
      setSelectedPlaylist({
        id: `artist-${group.name}`,
        name: group.name,
        description: `Essential tracks by ${group.name}`,
        tracks: group.tracks,
        createdAt: 0,
      });
      return;
    }
    const userPl = playlists.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (userPl) {
      setSelectedPlaylist(userPl);
      return;
    }
    // Fallback: search-based playlist
    const matched = ALL_TRACKS.filter(
      (t) =>
        t.artist.toLowerCase().includes(name.toLowerCase()) ||
        t.title.toLowerCase().includes(name.toLowerCase())
    );
    setSelectedPlaylist({
      id: `collection-${name}`,
      name,
      description: `Curated collection: ${name}`,
      tracks: matched.length > 0 ? matched : TRENDING_TRACKS,
      createdAt: 0,
    });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex justify-center selection:bg-[#1DB954] selection:text-black font-sans">
      {/* Headless Audio Playback Engine */}
      <AudioPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        volume={volume}
        isMuted={isMuted}
        repeatMode={repeatMode}
        onTimeUpdate={(cur, dur) => {
          setCurrentTime(cur);
          if (dur > 0) setDuration(dur);
        }}
        onTrackEnd={handleNext}
        onError={(err) => showToast(err)}
        seekTime={seekTime}
        onSeekHandled={() => setSeekTime(null)}
      />

      {/* Main Container framed as Mobile Android Device */}
      <main className="w-full max-w-md min-h-screen bg-[#121212] flex flex-col relative shadow-2xl overflow-x-hidden border-x border-white/5">
        {/* Android Simulated Status Bar */}
        <div className="w-full px-5 py-2 flex items-center justify-between text-[11px] font-semibold text-neutral-300 select-none bg-gradient-to-b from-black/60 to-transparent">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] tracking-wider">5G</span>
            <span>📶</span>
            <span>100% 🔋</span>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {selectedPlaylist ? (
            <PlaylistDetailView
              playlist={
                selectedPlaylist.id === 'liked-songs'
                  ? { ...selectedPlaylist, tracks: likedTracks }
                  : selectedPlaylist
              }
              currentTrackId={currentTrack?.id}
              likedTrackIds={likedTrackIds}
              onBack={() => setSelectedPlaylist(null)}
              onPlayTrack={handlePlayTrack}
              onPlayAll={handlePlayAll}
              onToggleLike={handleToggleLike}
              onOpenTrackMenu={(track) => setMenuTrack(track)}
              onDeletePlaylist={handleDeletePlaylist}
            />
          ) : activeTab === 'home' ? (
            <HomeScreen
              onPlayTrack={handlePlayTrack}
              onOpenLikedSongs={openLikedSongsView}
              onOpenPlaylistByName={openPlaylistByName}
              onOpenSettings={() => setIsSettingsOpen(true)}
              likedTrackIds={likedTrackIds}
            />
          ) : activeTab === 'search' ? (
            <SearchScreen
              onPlayTrack={handlePlayTrack}
              likedTrackIds={likedTrackIds}
              onToggleLike={handleToggleLike}
              onOpenTrackMenu={(track) => setMenuTrack(track)}
            />
          ) : (
            <LibraryScreen
              playlists={playlists}
              likedTracks={likedTracks}
              onOpenPlaylist={(pl) => setSelectedPlaylist(pl)}
              onOpenLikedSongs={openLikedSongsView}
              onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
            />
          )}
        </div>

        {/* Floating Mini Player Docked Above Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto pointer-events-none">
          <div className="pointer-events-auto">
            <MiniPlayer
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              isLiked={currentTrack ? likedTrackIds.has(currentTrack.id) : false}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onToggleLike={handleToggleLike}
              onOpenFullScreen={() => setIsFullScreenPlayerOpen(true)}
            />
            <BottomNav
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setSelectedPlaylist(null);
                setActiveTab(tab);
              }}
            />
          </div>
        </div>

        {/* Full-Screen Now Playing Player */}
        <FullScreenPlayer
          isOpen={isFullScreenPlayerOpen}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isShuffle={isShuffle}
          repeatMode={repeatMode}
          isLiked={currentTrack ? likedTrackIds.has(currentTrack.id) : false}
          sourceName={selectedPlaylist ? selectedPlaylist.name : 'Curated Tracks'}
          onClose={() => setIsFullScreenPlayerOpen(false)}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSeek={(sec) => setSeekTime(sec)}
          onToggleShuffle={() => setIsShuffle(!isShuffle)}
          onToggleRepeat={() => {
            const modes: RepeatMode[] = ['off', 'all', 'one'];
            const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
            setRepeatMode(nextMode);
          }}
          onToggleLike={handleToggleLike}
          onVolumeChange={(v) => {
            setVolume(v);
            if (isMuted && v > 0) setIsMuted(false);
          }}
          onToggleMute={() => setIsMuted(!isMuted)}
          onOpenQueue={() => setIsQueueOpen(true)}
          onOpenTrackMenu={(track) => setMenuTrack(track)}
        />

        {/* Play Queue Sheet */}
        <QueueSheet
          isOpen={isQueueOpen}
          currentTrack={currentTrack}
          queue={queue}
          likedTrackIds={likedTrackIds}
          onClose={() => setIsQueueOpen(false)}
          onPlayTrack={(track) => {
            handlePlayTrack(track);
            setIsQueueOpen(false);
          }}
          onToggleLike={handleToggleLike}
          onOpenTrackMenu={(track) => setMenuTrack(track)}
          onClearQueue={() => setQueue([])}
        />

        {/* Track Context Menu Sheet */}
        <TrackMenuSheet
          track={menuTrack}
          isOpen={Boolean(menuTrack)}
          isLiked={menuTrack ? likedTrackIds.has(menuTrack.id) : false}
          onClose={() => setMenuTrack(null)}
          onPlayNow={(t) => handlePlayTrack(t)}
          onAddToQueue={(t) => {
            setQueue((prev) => [...prev, t]);
            showToast('Added to queue');
          }}
          onAddToPlaylist={(t) => setAddToPlaylistTrack(t)}
          onToggleLike={handleToggleLike}
        />

        {/* Create Playlist Modal */}
        <CreatePlaylistModal
          isOpen={isCreatePlaylistOpen}
          onClose={() => setIsCreatePlaylistOpen(false)}
          onCreate={handleCreatePlaylist}
        />

        {/* Add To Playlist Modal */}
        <AddToPlaylistModal
          isOpen={Boolean(addToPlaylistTrack)}
          track={addToPlaylistTrack}
          playlists={playlists}
          onClose={() => setAddToPlaylistTrack(null)}
          onToggleTrackInPlaylist={handleToggleTrackInPlaylist}
          onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
        />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          apiKey={apiKey}
          onClose={() => setIsSettingsOpen(false)}
          onSaveApiKey={(key) => {
            setApiKey(key);
            try {
              localStorage.setItem('spotify_yt_api_key', key);
            } catch (e) {}
            showToast('Settings saved');
          }}
        />

        {/* Toast Notification Notification Pill */}
        {toastMessage && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#282828] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {toastMessage}
          </div>
        )}
      </main>
    </div>
  );
}
