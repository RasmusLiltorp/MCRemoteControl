const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  generateKeys: () => ipcRenderer.invoke('generate-keys'),
  copyPublicKey: () => ipcRenderer.invoke('copy-public-key'),
  OpenFilePath: () => ipcRenderer.invoke('OpenFilePath'),
  openGitHub: () => ipcRenderer.invoke('open-github'),
  connectToServer: (address) => ipcRenderer.invoke('connect-to-server', address),
  startServer: () => ipcRenderer.invoke('start-server'),
  stopServer: () => ipcRenderer.invoke('stop-server'),
  loadSavedConfig: () => ipcRenderer.invoke('loadSavedConfig'),
  saveConfig: (address, privateKey) => ipcRenderer.invoke('saveConfig', address, privateKey),
  closeWindow: () => ipcRenderer.send('close-window'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  createSignature: (privateKey, message) => ipcRenderer.invoke('create-signature', privateKey, message)
});