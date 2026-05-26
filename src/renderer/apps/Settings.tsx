import React, { useState } from 'react';
import { WindowInstance } from '../types/os';
import { Monitor, Palette, Info, Shield, Wifi, Volume2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const WALLPAPERS = [
  { id: '1', name: 'Deep Sea', value: 'linear-gradient(to bottom right, #1e3a8a, #581c87, #831843)' },
  { id: '2', name: 'Sunset', value: 'linear-gradient(to bottom right, #f87171, #f59e0b, #7c3aed)' },
  { id: '3', name: 'Midnight', value: 'linear-gradient(to bottom right, #000000, #434343)' },
  { id: '4', name: 'Forest', value: 'linear-gradient(to bottom right, #064e3b, #14532d, #365314)' },
];

const Settings: React.FC<{ window: WindowInstance }> = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [currentWallpaper, setCurrentWallpaper] = useState(WALLPAPERS[0].id);

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'display', name: 'Display', icon: Monitor },
    { id: 'network', name: 'Network', icon: Wifi },
    { id: 'sound', name: 'Sound', icon: Volume2 },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'about', name: 'About', icon: Info },
  ];

  return (
    <div className="h-full bg-os-bg flex select-none text-white">
      {/* Sidebar */}
      <div className="w-48 border-r border-white/10 flex flex-col bg-black/20 p-4 gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={twMerge(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
              activeTab === tab.id ? "bg-white/10" : "hover:bg-white/5 opacity-60 hover:opacity-100"
            )}
          >
            <tab.icon size={16} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-auto bg-white/[0.02]">
        {activeTab === 'appearance' && (
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold mb-6">Appearance</h2>
            
            <section className="mb-8">
              <h3 className="text-sm font-semibold opacity-40 uppercase tracking-widest mb-4">Wallpaper</h3>
              <div className="grid grid-cols-2 gap-4">
                {WALLPAPERS.map(wp => (
                  <div 
                    key={wp.id}
                    onClick={() => setCurrentWallpaper(wp.id)}
                    className={twMerge(
                      "group cursor-default relative rounded-xl overflow-hidden aspect-video border-2 transition-all",
                      currentWallpaper === wp.id ? "border-os-accent" : "border-transparent"
                    )}
                  >
                    <div 
                      className="w-full h-full" 
                      style={{ background: wp.value }} 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs font-medium">{wp.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold opacity-40 uppercase tracking-widest mb-4">Accent Color</h3>
              <div className="flex gap-4">
                {['#007aff', '#ff3b30', '#4cd964', '#ffcc00'].map(color => (
                  <div 
                    key={color}
                    className="w-8 h-8 rounded-full cursor-default ring-2 ring-transparent hover:ring-white/20 transition-all border-2 border-os-bg"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-xl flex flex-col items-center text-center pt-8">
            <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-2xl">
              
            </div>
            <h2 className="text-3xl font-bold mb-2">DesktopOS</h2>
            <p className="text-sm opacity-50 mb-8">Version 1.0.0 (May 2026)</p>
            
            <div className="w-full bg-white/5 rounded-2xl p-6 text-left border border-white/5 space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="opacity-50">Processor</span>
                <span>Virtual Silicon G1</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="opacity-50">Memory</span>
                <span>16 GB Unified Virtual Memory</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="opacity-50">Graphics</span>
                <span>Metal 3.0 (Emulated)</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">Serial Number</span>
                <span className="font-mono">GEMINI-2026-X86-T4</span>
              </div>
            </div>
          </div>
        )}

        {!['appearance', 'about'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center h-full opacity-20">
            <Info size={48} className="mb-4" />
            <p>This setting is not available in the simulation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
