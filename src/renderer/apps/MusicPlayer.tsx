import React, { useState, useEffect } from 'react';
import { WindowInstance } from '../types/os';
import { Play, Pause, SkipBack, SkipForward, Volume2, List } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: string;
}

const PLAYLIST: Track[] = [
  { id: '1', title: 'Starlight', artist: 'Muse', duration: '3:59', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop' },
  { id: '2', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop' },
  { id: '3', title: 'Midnight City', artist: 'M83', duration: '4:03', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop' },
  { id: '4', title: 'Instant Crush', artist: 'Daft Punk', duration: '5:37', cover: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=400&h=400&fit=crop' },
];

const MusicPlayer: React.FC<{ window: WindowInstance }> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % PLAYLIST.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
  };

  return (
    <div className="h-full bg-gradient-to-b from-gray-900 to-black flex flex-col select-none text-white relative">
      <div className="flex-1 p-8 flex flex-col items-center justify-center relative z-10">
        {/* Album Art */}
        <div className={twMerge(
          "w-48 h-48 rounded-2xl shadow-2xl mb-8 overflow-hidden transition-transform duration-700",
          isPlaying ? "scale-105 shadow-blue-500/20" : "scale-95"
        )}>
          <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
        </div>

        {/* Track Info */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold mb-1">{currentTrack.title}</h2>
          <p className="text-sm opacity-50">{currentTrack.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mb-8">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-os-accent transition-all duration-1000" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] opacity-40 font-mono">
            <span>0:00</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button onClick={prevTrack} className="hover:text-os-accent transition-colors">
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
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
            <h3 className="font-bold">Next Up</h3>
            <button onClick={() => setShowPlaylist(false)} className="text-sm opacity-50 hover:opacity-100">Close</button>
          </div>
          <div className="flex flex-col gap-1">
            {PLAYLIST.map((track, index) => (
              <div 
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setProgress(0);
                  setIsPlaying(true);
                  setShowPlaylist(false);
                }}
                className={twMerge(
                  "flex items-center gap-4 p-3 rounded-xl transition-colors cursor-default",
                  index === currentTrackIndex ? "bg-os-accent/20" : "hover:bg-white/5"
                )}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 truncate">
                  <div className="text-sm font-medium truncate">{track.title}</div>
                  <div className="text-[11px] opacity-40 truncate">{track.artist}</div>
                </div>
                <div className="text-xs opacity-40 font-mono">{track.duration}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
