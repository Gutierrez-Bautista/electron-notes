import { Menu } from 'electron'

const isMac = process.platform === 'darwin'

export const setupMenu = (win) => {
  const template = [
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Themes',
          submenu: [
            {
              label: 'Light',
              click: () => win.webContents.send('change-theme', 'light')
            },
            {
              label: 'Dark',
              click: () => win.webContents.send('change-theme', 'dark')
            }
          ]
        }
      ]
    }
  ]
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}