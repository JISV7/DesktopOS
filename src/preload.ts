import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  fs: {
    listDir: (path: string) => ipcRenderer.invoke('fs:listDir', path),
    getHomeDir: () => ipcRenderer.invoke('fs:getHomeDir'),
  }
});
