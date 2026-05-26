import React, { useState, useRef, useEffect } from 'react';
import { WindowInstance } from '../types/os';
import { RotateCw, CameraOff } from 'lucide-react';

const Camera: React.FC<{ window: WindowInstance }> = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFlash, setIsFlash] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        setError("Camera access denied or not found.");
      }
    }
    setupCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const takePhoto = () => {
    if (!videoRef.current) return;
    
    setIsFlash(true);
    setTimeout(() => setIsFlash(false), 150);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      setPhotos(prev => [canvas.toDataURL('image/png'), ...prev]);
    }
  };

  return (
    <div className="h-full bg-black flex flex-col select-none text-white overflow-hidden relative">
      {/* Flash Effect */}
      {isFlash && <div className="absolute inset-0 bg-white z-[100] animate-pulse" />}

      {/* Main Viewport */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-900 overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center gap-4 opacity-50">
            <CameraOff size={64} />
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover scale-x-[-1]" 
          />
        )}

        {/* Shutter Button */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center opacity-0 pointer-events-none">
            <RotateCw size={24} />
          </div>
          <button 
            onClick={takePhoto}
            disabled={!!error}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform active:scale-90 disabled:opacity-30 disabled:hover:scale-100"
          >
            <div className="w-12 h-12 bg-white rounded-full" />
          </button>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-default">
            <RotateCw size={24} />
          </div>
        </div>

        {/* Recent Photo Preview */}
        {photos.length > 0 && (
          <div className="absolute bottom-10 left-8 w-12 h-12 rounded-lg border-2 border-white/50 overflow-hidden shadow-xl hover:scale-110 transition-transform cursor-default">
            <img src={photos[0]} alt="Recent" className="w-full h-full object-cover scale-x-[-1]" />
          </div>
        )}
      </div>

      {/* Sidebar Gallery (hidden if empty) */}
      {photos.length > 0 && (
        <div className="h-24 bg-black/80 backdrop-blur-xl border-t border-white/10 p-3 flex gap-3 overflow-x-auto custom-scrollbar">
          {photos.map((p, i) => (
            <div key={i} className="h-full aspect-square rounded-md overflow-hidden shrink-0 border border-white/10">
              <img src={p} alt={`Photo ${i}`} className="w-full h-full object-cover scale-x-[-1]" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Camera;
