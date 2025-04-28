import { app, BrowserWindow } from 'electron'
import path from 'node:path'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 600
  })

  win.loadFile(path.join(app.getAppPath(), 'dist-react', 'index.html'))
}

app.whenReady().then(() => {
  createWindow()
})