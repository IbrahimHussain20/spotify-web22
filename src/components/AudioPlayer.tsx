'use client';

import React, { useEffect, useRef } from 'react';
import { RepeatMode, Track } from '@/types';

interface AudioPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onTrackEnd: () => void;
  onError: (msg: string) => void;
  onPlayerReady?: () => void;
  seekTime: number | null;
  onSeekHandled: () => void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: any;
  }
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentTrack,
  isPlaying,
  volume,
  isMuted,
  repeatMode,
  onTimeUpdate,
  onTrackEnd,
  onError,
  seekTime,
  onSeekHandled,
}) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<any>(null);
  const isApiReady = useRef(false);

  // Initialize YT Iframe API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      isApiReady.current = true;
      initPlayer();
    };

    if (window.YT && window.YT.Player) {
      isApiReady.current = true;
      initPlayer();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      try {
        playerRef.current?.destroy();
      } catch (e) {}
    };
  }, []);

  const initPlayer = () => {
    if (!window.YT || !containerRef.current || playerRef.current) return;

    try {
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '1',
        width: '1',
        videoId: currentTrack?.id || '',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(isMuted ? 0 : volume);
            if (currentTrack && isPlaying) {
              event.target.loadVideoById(currentTrack.id);
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.ENDED = 0
            if (event.data === 0) {
              if (repeatMode === 'one') {
                event.target.seekTo(0, true);
                event.target.playVideo();
              } else {
                onTrackEnd();
              }
            }
          },
          onError: (event: any) => {
            console.warn('YouTube player error code:', event.data);
            onError('Could not play this track. Moving forward...');
            onTrackEnd();
          },
        },
      });
    } catch (err) {
      console.error('Error creating YT player:', err);
    }
  };

  // Handle currentTrack change
  useEffect(() => {
    if (!playerRef.current || !currentTrack) return;

    try {
      if (playerRef.current.loadVideoById) {
        playerRef.current.loadVideoById(currentTrack.id);
        if (!isPlaying) {
          playerRef.current.pauseVideo();
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentTrack?.id]);

  // Handle Play / Pause
  useEffect(() => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo?.();
      } else {
        playerRef.current.pauseVideo?.();
      }
    } catch (e) {}
  }, [isPlaying]);

  // Handle Volume & Mute
  useEffect(() => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.mute?.();
      } else {
        playerRef.current.unMute?.();
        playerRef.current.setVolume?.(volume);
      }
    } catch (e) {}
  }, [volume, isMuted]);

  // Handle Seeking
  useEffect(() => {
    if (seekTime !== null && playerRef.current?.seekTo) {
      try {
        playerRef.current.seekTo(seekTime, true);
        onSeekHandled();
      } catch (e) {}
    }
  }, [seekTime]);

  // Time update ticker
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;
      try {
        const cur = playerRef.current.getCurrentTime?.() || 0;
        const dur = playerRef.current.getDuration?.() || currentTrack?.durationSeconds || 0;
        onTimeUpdate(Math.floor(cur), Math.floor(dur));
      } catch (e) {}
    }, 250);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentTrack]);

  return (
    <div className="fixed -left-96 -top-96 w-1 h-1 overflow-hidden pointer-events-none opacity-0">
      <div ref={containerRef} />
    </div>
  );
};
