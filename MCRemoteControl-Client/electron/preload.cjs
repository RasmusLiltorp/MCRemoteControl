const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  generateKeys: () => ipcRenderer.invoke('generate-keys'),
  copyPublicKey: () => ipcRenderer.invoke('copy-public-key'),
  OpenFilePath: () => ipcRenderer.invoke('OpenFilePath'),
  
  connectToServer: (address) => ipcRenderer.invoke('connect-to-server', address),
  startServer: () => ipcRenderer.invoke('start-server'),
  stopServer: () => ipcRenderer.invoke('stop-server'),
  closeWindow: () => ipcRenderer.send('close-window'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  openGitHub: () => ipcRenderer.invoke('open-github')

});