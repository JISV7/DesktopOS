export interface ElectronFile {
  name: string;
  isDirectory: boolean;
  path: string;
  size: number;
  mtime: number;
}

export interface ElectronAPI {
  fs: {
    listDir: (path: string) => Promise<ElectronFile[]>;
    getHomeDir: () => Promise<string>;
  }
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
