import { app, BrowserWindow } from 'electron'
import { setupMenu } from './menu.js'
import { fileURLToPath } from 'url'
import { dirname, join as joinPath } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: joinPath(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  setupMenu(win)
}

app.whenReady().then(() => {
  console.log(__dirname)
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
