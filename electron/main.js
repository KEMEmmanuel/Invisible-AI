const { app, BrowserWindow, ipcMain, globalShortcut, desktopCapturer } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { speak, startSapiRecognition } = require('./sapi');

let mainWindow;

// Stealth: Process Name Disguise
// We set the name before the app is ready
app.name = 'RuntimeBroker';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 700,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'Nova AI',
    icon: path.join(__dirname, '../public/favicon.ico'),
    // Hide from taskbar for extra stealth if needed, but let's keep it for now
    // skipTaskbar: true,
  });

  // Stealth: Hide from screen capture (Critical Requirement)
  mainWindow.setContentProtection(true);

  const url = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../out/index.html')}`;

  mainWindow.loadURL(url);

  // Ensure window is always on top even when it loses focus
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', () => {
  createWindow();

  // Global Keyboard Shortcuts
  // Alt+V: Toggle voice recognition mode
  globalShortcut.register('Alt+V', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.webContents.send('toggle-voice');
    }
  });

  // Alt+S: Capture screenshot for OCR
  globalShortcut.register('Alt+S', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.webContents.send('capture-screen');
    }
  });

  // Alt+C: Clear chat history
  globalShortcut.register('Alt+C', () => {
    if (mainWindow) {
      mainWindow.webContents.send('clear-chat');
    }
  });

  // Alt+X: Toggle window visibility (Stealth)
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
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.on('speak-sapi', (event, text) => {
  speak(text);
});

ipcMain.on('start-sapi-stt', () => {
  startSapiRecognition((text) => {
    if (mainWindow) {
      mainWindow.webContents.send('voice-transcript', text);
    }
  });
});

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

ipcMain.on('set-ignore-mouse', (event, ignore) => {
  if (mainWindow) {
    mainWindow.setIgnoreMouseEvents(ignore, { forward: true });
  }
});
