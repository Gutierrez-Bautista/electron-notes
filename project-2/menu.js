import { Menu } from 'electron'

const isMac = process.platform === 'darwin'

export const setupMenu = () => {
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
          label: 'Langs',
          submenu: [
            {
              label: 'English',
              click: () => { console.log('English') }
            },
            {
              label: 'Spanish',
              click: () => { console.log('Spanish') }
            }
          ]
        },
        {
          label: 'Themes',
          submenu: [
            {
              label: 'Light',
              click: () => { console.log('Light') }
            },
            {
              label: 'Dark',
              click: () => { console.log('Dark') }
            }
          ]
        }
      ]
    }
  ]
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}