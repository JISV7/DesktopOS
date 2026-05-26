export type WindowState = 'normal' | 'minimized' | 'maximized';

export interface WindowInstance {
  id: string;
  appId: string;
  title: string;
  icon?: string;
  zIndex: number;
  isFocused: boolean;
  state: WindowState;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize?: { width: number; height: number };
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<{ window: WindowInstance }>;
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  singleton?: boolean;
}
