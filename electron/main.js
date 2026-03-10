const { app, BrowserWindow, ipcMain, globalShortcut, desktopCapturer, screen } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { speak, startSapiRecognition } = require('./sapi');

let mainWindow;

app.name = 'RuntimeBroker';

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: 450,
    height: 700,
    x: width - 480,
    y: height - 730,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'Nova AI',
  });

  mainWindow.setContentProtection(true);

  const url = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../out/index.html')}`;

  mainWindow.loadURL(url);

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', () => {
  createWindow();

  globalShortcut.register('Alt+V', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.webContents.send('toggle-voice');
    }
  });

  globalShortcut.register('Alt+S', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.webContents.send('capture-screen');
    }
  });

  globalShortcut.register('Alt+C', () => {
    if (mainWindow) {
      mainWindow.webContents.send('clear-chat');
    }
  });

  globalShortcut.register('Alt+X', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('get-desktop-sources', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width: 1920, height: 1080 }
  });
  return sources.map(source => ({
    id: source.id,
    name: source.name,
    thumbnail: source.thumbnail.toDataURL(),
  }));
});

ipcMain.on('minimize-window', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('close-window', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on('resize-window', (event, { width, height, x, y }) => {
  if (mainWindow) {
    if (x !== undefined && y !== undefined) {
      mainWindow.setBounds({ width, height, x, y }, true);
    } else {
      mainWindow.setSize(width, height, true);
    }
  }
});
