const { contextBridge, ipcRenderer } = require("electron");

// Exposing ipcRenderer to the renderer process (React app)
contextBridge.exposeInMainWorld("api", {
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
});
