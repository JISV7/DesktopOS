import { AppDefinition } from '../types/os';
import Calculator from './Calculator';
import Calendar from './Calendar';
import Notes from './Notes';
import Terminal from './Terminal';
import MusicPlayer from './MusicPlayer';
import Settings from './Settings';
import Camera from './Camera';
import FileManager from './FileManager';

export const APPS: AppDefinition[] = [
  {
    id: 'finder',
    name: 'Finder',
    icon: '📂',
    component: FileManager,
    defaultSize: { width: 800, height: 500 },
    singleton: false,
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: '🔢',
    component: Calculator,
    defaultSize: { width: 320, height: 480 },
    minSize: { width: 320, height: 480 },
    singleton: true,
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: '📅',
    component: Calendar,
    defaultSize: { width: 600, height: 500 },
    singleton: true,
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: '📝',
    component: Notes,
    defaultSize: { width: 700, height: 500 },
    singleton: false,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: '💻',
    component: Terminal,
    defaultSize: { width: 600, height: 400 },
    singleton: false,
  },
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    component: MusicPlayer,
    defaultSize: { width: 350, height: 550 },
    singleton: true,
  },
  {
    id: 'camera',
    name: 'Camera',
    icon: '📷',
    component: Camera,
    defaultSize: { width: 640, height: 520 },
    singleton: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    component: Settings,
    defaultSize: { width: 700, height: 500 },
    singleton: true,
  }
];
