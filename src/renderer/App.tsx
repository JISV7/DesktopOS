import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindowManager } from './hooks/useWindowManager';
import { Window } from './components/Window';
import { APPS } from './apps/registry';

const App: React.FC = () => {
  const { windows, openApp, closeWindow, focusWindow, updateWindow } = useWindowManager();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#000] text-os-fg relative flex flex-col font-sans select-none">
      {/* Background Wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(to bottom right, #1e3a8a, #581c87, #831843)',
          filter: 'brightness(0.8)'
        }}
      />

      {/* Menu Bar */}
      <div className="h-8 bg-black/20 backdrop-blur-2xl flex items-center px-4 border-b border-white/5 text-[12px] font-semibold z-[9999]">
        <div className="flex gap-4 items-center">
          <span className="text-lg mt-[-2px] hover:bg-white/10 px-2 rounded cursor-default"></span>
          <span className="font-bold hover:bg-white/10 px-2 rounded cursor-default">DesktopOS</span>
          <span className="opacity-80 hover:bg-white/10 px-2 rounded cursor-default hidden sm:block">File</span>
          <span className="opacity-80 hover:bg-white/10 px-2 rounded cursor-default hidden sm:block">Edit</span>
          <span className="opacity-80 hover:bg-white/10 px-2 rounded cursor-default hidden sm:block">View</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="opacity-80">
            {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <span className="opacity-80">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Desktop Area */}
      <div className="flex-1 relative overflow-hidden p-6">
        <div className="grid grid-cols-1 gap-6 w-20">
          <div className="flex flex-col items-center gap-1 group cursor-default">
            <div className="w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-all flex items-center justify-center text-3xl shadow-lg">
              📁
            </div>
            <span className="text-[11px] font-medium text-white shadow-black drop-shadow-md">Macintosh HD</span>
          </div>
        </div>
        
        {/* Windows */}
        <AnimatePresence>
          {windows.map(win => {
            const appDef = APPS.find(a => a.id === win.appId);
            const AppComponent = appDef?.component || (() => <div>App not found</div>);
            
            return (
              <Window
                key={win.id}
                window={win}
                onClose={closeWindow}
                onFocus={focusWindow}
                onUpdate={updateWindow}
              >
                <AppComponent window={win} />
              </Window>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10000]">
        <div className="px-3 py-2 bg-white/10 backdrop-blur-3xl rounded-[24px] border border-white/10 flex items-center gap-2 shadow-2xl">
          {APPS.map(app => {
            const isOpen = windows.some(w => w.appId === app.id);
            const isFocused = windows.some(w => w.appId === app.id && w.isFocused);
            
            return (
              <div 
                key={app.id}
                className="relative group flex flex-col items-center"
              >
                <div 
                  className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl cursor-default hover:scale-110 transition-transform active:scale-95 shadow-lg border border-white/5"
                  onClick={() => openApp(app)}
                >
                  {app.icon}
                </div>
                {/* Indicator dot */}
                {isOpen && (
                  <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${isFocused ? 'bg-white' : 'bg-white/40'}`} />
                )}
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs whitespace-nowrap border border-white/10">
                  {app.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
