import { useState, useCallback } from 'react';
import { WindowInstance, AppDefinition } from '../types/os';

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1);

  const openApp = useCallback((app: AppDefinition) => {
    const existing = windows.find(w => w.appId === app.id);
    if (app.singleton && existing) {
      focusWindow(existing.id);
      return;
    }

    const newWindow: WindowInstance = {
      id: Math.random().toString(36).substr(2, 9),
      appId: app.id,
      title: app.name,
      icon: app.icon,
      zIndex: nextZIndex,
      isFocused: true,
      state: 'normal',
      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
      size: app.defaultSize || { width: 600, height: 400 },
      minSize: app.minSize,
    };

    setWindows(prev => prev.map(w => ({ ...w, isFocused: false })).concat(newWindow));
    setNextZIndex(prev => prev + 1);
  }, [windows, nextZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => {
      const isAlreadyFocused = prev.find(w => w.id === id)?.isFocused;
      if (isAlreadyFocused) return prev;

      return prev.map(w => ({
        ...w,
        isFocused: w.id === id,
        zIndex: w.id === id ? nextZIndex : w.zIndex,
      }));
    });
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const updateWindow = useCallback((id: string, updates: Partial<WindowInstance>) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  }, []);

  return {
    windows,
    openApp,
    closeWindow,
    focusWindow,
    updateWindow,
  };
}
