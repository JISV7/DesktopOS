import React, { useState, useEffect, useRef } from 'react';
import { WindowInstance } from '../types/os';
import { Play, Pause, SkipBack, SkipForward, Volume2, List, Music } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { ElectronFile } from '../types/electron';

const MusicPlayer: React.FC<{ window: WindowInstance }> = () => {
  const [playlist, setPlaylist] = useState<ElectronFile[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    async function loadLibrary() {
      const library = await window.electron.music.getLibrary();
      setPlaylist(library);
    }
    loadLibrary();
  }, []);

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    if (playlist.length === 0) return;
    setCurrentTrackIndex((currentTrackIndex + 1) % playlist.length);
    setProgress(0);
  };

  const prevTrack = () => {
    if (playlist.length === 0) return;
    setCurrentTrackIndex((currentTrackIndex - 1 + playlist.length) % playlist.length);
    setProgress(0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full bg-gradient-to-b from-gray-900 to-black flex flex-col select-none text-white relative">
      {currentTrack && (
        <audio 
          ref={audioRef}
          src={`media://${currentTrack.path}`}
          onTimeUpdate={handleTimeUpdate}
          onEnded={nextTrack}
        />
      )}

      <div className="flex-1 p-8 flex flex-col items-center justify-center relative z-10">
        {/* Album Art Placeholder */}
        <div className={twMerge(
          "w-48 h-48 rounded-2xl shadow-2xl mb-8 overflow-hidden transition-transform duration-700 flex items-center justify-center bg-white/5",
          isPlaying ? "scale-105 shadow-blue-500/20" : "scale-95"
        )}>
          <Music size={80} className="text-os-accent opacity-20" />
        </div>

        {/* Track Info */}
        <div className="text-center mb-8 w-full px-4">
          <h2 className="text-xl font-bold mb-1 truncate">
            {currentTrack ? currentTrack.name.replace(/\.[^/.]+$/, "") : "No Music Found"}
          </h2>
          <p className="text-sm opacity-50">
            {currentTrack ? "Local Audio" : "Add music to your Music folder"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mb-8">
          <div 
            className="h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              if (audioRef.current && duration) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const clickedProgress = x / rect.width;
                audioRef.current.currentTime = clickedProgress * duration;
              }
            }}
          >
            <div 
              className="h-full bg-os-accent transition-all duration-100" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] opacity-40 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button onClick={prevTrack} className="hover:text-os-accent transition-colors">
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button 
            onClick={togglePlay}
            disabled={!currentTrack}
            className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform active:scale-95 disabled:opacity-20 disabled:scale-100"
          >
            {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
          </button>
          <button onClick={nextTrack} className="hover:text-os-accent transition-colors">
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Footer / Playlist Toggle */}
      <div className="h-12 bg-black/40 border-t border-white/5 px-6 flex items-center justify-between relative z-20">
        <Volume2 size={18} className="opacity-50" />
        <button 
          onClick={() => setShowPlaylist(!showPlaylist)}
          className={twMerge("transition-colors", showPlaylist ? "text-os-accent" : "opacity-50 hover:opacity-100")}
        >
          <List size={18} />
        </button>
      </div>

      {/* Playlist Overlay */}
      {showPlaylist && (
        <div className="absolute inset-0 bg-black/95 z-30 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Library</h3>
            <button onClick={() => setShowPlaylist(false)} className="text-sm opacity-50 hover:opacity-100">Close</button>
          </div>
          <div className="flex flex-col gap-1">
            {playlist.length === 0 && <div className="text-sm opacity-30 text-center py-8">No tracks found in ~/Music</div>}
            {playlist.map((track, index) => (
              <div 
                key={track.path}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true);
                  setShowPlaylist(false);
                }}
                className={twMerge(
                  "flex items-center gap-4 p-3 rounded-xl transition-colors cursor-default",
                  index === currentTrackIndex ? "bg-os-accent/20" : "hover:bg-white/5"
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Music size={20} className="text-os-accent opacity-50" />
                </div>
                <div className="flex-1 truncate">
                  <div className="text-sm font-medium truncate">{track.name.replace(/\.[^/.]+$/, "")}</div>
                  <div className="text-[11px] opacity-40 truncate">Local File</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
