import { app, BrowserWindow, ipcMain, shell, protocol, net } from 'electron';
import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import started from 'electron-squirrel-startup';

const execPromise = promisify(exec);

// Register custom protocol privileges
protocol.registerSchemesAsPrivileged([
  { 
    scheme: 'media', 
    privileges: { 
      secure: true, 
      standard: true, 
      supportFetchAPI: true, 
      stream: true,
      bypassCSP: true
    } 
  }
]);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

ipcMain.handle('fs:listDir', async (_, dirPath: string) => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.map(entry => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      path: path.join(dirPath, entry.name),
      size: 0,
      mtime: Date.now()
    }));
  } catch (error) {
    console.error('Failed to list directory:', error);
    throw error;
  }
});

ipcMain.handle('fs:getHomeDir', () => {
  return os.homedir();
});

ipcMain.handle('fs:readFile', async (_, filePath: string) => {
  return await fs.readFile(filePath, 'utf-8');
});

ipcMain.handle('fs:openFile', async (_, filePath: string) => {
  return await shell.openPath(filePath);
});

ipcMain.handle('shell:execute', async (_, command: string, cwd: string) => {
  try {
    const { stdout, stderr } = await execPromise(command, { cwd });
    return { stdout, stderr };
  } catch (error: any) {
    return { stdout: error.stdout || '', stderr: error.stderr || error.message };
  }
});

ipcMain.handle('music:getLibrary', async () => {
  const musicDir = path.join(os.homedir(), 'Music');
  try {
    const files = await fs.readdir(musicDir, { withFileTypes: true });
    return files
      .filter(file => !file.isDirectory() && /\.(mp3|wav|ogg|m4a)$/i.test(file.name))
      .map(file => ({
        name: file.name,
        isDirectory: false,
        path: path.join(musicDir, file.name),
        size: 0,
        mtime: Date.now()
      }));
  } catch (error) {
    console.error('Failed to read music library:', error);
    return [];
  }
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  protocol.handle('media', (request) => {
    const filePath = decodeURIComponent(request.url.replace('media://', ''));
    try {
      return net.fetch(pathToFileURL(filePath).toString());
    } catch (error) {
      console.error('Protocol error:', error);
      return new Response('Not Found', { status: 404 });
    }
  });
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

