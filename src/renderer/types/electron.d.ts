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
    readFile: (path: string) => Promise<string>;
    openFile: (path: string) => Promise<void>;
  };
  shell: {
    execute: (command: string, cwd: string) => Promise<{ stdout: string; stderr: string }>;
  };
  music: {
    getLibrary: () => Promise<ElectronFile[]>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
