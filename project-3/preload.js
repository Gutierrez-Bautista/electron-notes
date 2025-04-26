const { contextBridge, ipcRenderer } = require('electron')

console.log('preload')

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateTheme: callback => { ipcRenderer.on('change-theme', callback) }
})
