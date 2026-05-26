import { AppDefinition } from '../types/os';
import Calculator from './Calculator';

export const APPS: AppDefinition[] = [
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
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    component: () => null, // Placeholder
    defaultSize: { width: 600, height: 400 },
    singleton: true,
  }
];
