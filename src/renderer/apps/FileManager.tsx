import React, { useState, useEffect } from 'react';
import { WindowInstance } from '../types/os';
import { Folder, File, ChevronRight, Home, Download, FileText, Image as ImageIcon, Music as MusicIcon } from 'lucide-react';
import type { ElectronFile } from '../types/electron';

const FileManager: React.FC<{ window: WindowInstance }> = () => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [entries, setEntries] = useState<ElectronFile[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const home = await window.electron.fs.getHomeDir();
      setCurrentPath(home);
      loadDir(home);
    }
    init();
  }, []);

  const loadDir = async (path: string) => {
    setLoading(true);
    try {
      const result = await window.electron.fs.listDir(path);
      setEntries(result.sort((a, b) => (a.isDirectory === b.isDirectory ? a.name.localeCompare(b.name) : a.isDirectory ? -1 : 1)));
      setCurrentPath(path);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    setHistory([...history, currentPath]);
    loadDir(path);
  };

  const sidebarItems = [
    { name: 'Home', icon: Home, path: 'home' },
    { name: 'Documents', icon: FileText, path: 'Documents' },
    { name: 'Downloads', icon: Download, path: 'Downloads' },
    { name: 'Pictures', icon: ImageIcon, path: 'Pictures' },
    { name: 'Music', icon: MusicIcon, path: 'Music' },
  ];

  const handleSidebarClick = async (item: typeof sidebarItems[0]) => {
    const home = await window.electron.fs.getHomeDir();
    if (item.path === 'home') {
      navigateTo(home);
    } else {
      navigateTo(`${home}/${item.path}`);
    }
  };

  const pathParts = currentPath.split(/[/\\]/).filter(Boolean);

  return (
    <div className="h-full bg-os-bg flex select-none text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 border-r border-white/10 flex flex-col bg-black/20 p-2 gap-1">
        <div className="px-3 py-2 text-[10px] font-bold opacity-30 uppercase tracking-widest">Favorites</div>
        {sidebarItems.map(item => (
          <button
            key={item.name}
            onClick={() => handleSidebarClick(item)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-sm opacity-80 hover:opacity-100"
          >
            <item.icon size={16} className="text-os-accent" />
            {item.name}
          </button>
        ))}
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-10 border-b border-white/10 flex items-center px-4 gap-4 bg-white/5">
          <div className="flex items-center gap-1 text-xs opacity-60 overflow-hidden">
            {pathParts.map((part, i) => (
              <React.Fragment key={i}>
                <span className="hover:text-white cursor-default truncate max-w-[100px]">{part}</span>
                {i < pathParts.length - 1 && <ChevronRight size={12} className="shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* File Grid */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="h-full flex items-center justify-center opacity-20">Loading...</div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
              {entries.map(entry => (
                <div 
                  key={entry.path}
                  onDoubleClick={() => entry.isDirectory && navigateTo(entry.path)}
                  className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/10 transition-all group cursor-default"
                >
                  <div className="w-12 h-12 flex items-center justify-center relative">
                    {entry.isDirectory ? (
                      <Folder size={40} className="text-blue-400 fill-blue-400/20 group-hover:scale-110 transition-transform" />
                    ) : (
                      <File size={36} className="text-gray-400 group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                  <span className="text-[11px] text-center break-all line-clamp-2 w-full px-1">
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManager;
