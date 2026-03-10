const { ipcRenderer, contextBridge } = require('electron');

// contextBridge.exposeInMainWorld('electron', {
//   send: (channel, data) => {
//     ipcRenderer.send(channel, data);
//   },
//   receive: (channel, func) => {
//     ipcRenderer.on(channel, (event, ...args) => func(...args));
//   },
//   invoke: (channel, data) => {
//     return ipcRenderer.invoke(channel, data);
//   }
// });

// Using nodeIntegration: true and contextIsolation: false for now to simplify
// But let's at least provide a basic bridge if needed.
