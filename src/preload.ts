import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  fs: {
    listDir: (path: string) => ipcRenderer.invoke('fs:listDir', path),
    getHomeDir: () => ipcRenderer.invoke('fs:getHomeDir'),
    readFile: (path: string) => ipcRenderer.invoke('fs:readFile', path),
    openFile: (path: string) => ipcRenderer.invoke('fs:openFile', path),
  },
  shell: {
    execute: (command: string, cwd: string) => ipcRenderer.invoke('shell:execute', command, cwd),
  },
  music: {
    getLibrary: () => ipcRenderer.invoke('music:getLibrary'),
  }
});
