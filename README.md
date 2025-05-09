# Tabla de Contenidos

- [Tabla de Contenidos](#tabla-de-contenidos)
- [Electron](#electron)
  - [¿Qué es Electron?](#qué-es-electron)
  - [Ventajas de Electron](#ventajas-de-electron)
  - [Desventajas de Electron](#desventajas-de-electron)
  - [Aplicaciones Creadas con Electron](#aplicaciones-creadas-con-electron)
  - [Recursos para Aprender Electron](#recursos-para-aprender-electron)
  - [Crear proyecto de Electron](#crear-proyecto-de-electron)
  - [Renderizar Ventanas HTML](#renderizar-ventanas-html)
  - [Procesos en Electron](#procesos-en-electron)
  - [Terminar Proceso](#terminar-proceso)
  - [Menús Nativos](#menús-nativos)
    - [Plantilla de un Menú](#plantilla-de-un-menú)
    - [Ejemplo de Menú](#ejemplo-de-menú)
      - [File](#file)
      - [View](#view)
      - [Settings](#settings)
      - [Ejemplo Completo](#ejemplo-completo)
  - [Comunicar Procesos](#comunicar-procesos)
- [Electron, React y TypeScript](#electron-react-y-typescript)
  - [Creación del proyecto](#creación-del-proyecto)
    - [React y TypeScript](#react-y-typescript)
    - [Electron](#electron-1)
    - [Configurar TypeScript para Electron](#configurar-typescript-para-electron)
    - [Electron Builder](#electron-builder)
  - [Proceso de Desarrollo](#proceso-de-desarrollo)

# Electron

## ¿Qué es Electron?

Electron es un Framework de JavaScript (JS de ahora en más) que permite crear aplicaciones de escritorio con tecnologías web como HTML, CSS y JS que pueden ejecutarse en Windows, MacOS y Linux. Esto se logra gracias a incrustar Chromium y NodeJS dentro de la aplicación, lo que permite mantener un único código para la aplicación en todos los dispositivos.

Si bien es evidente que el rendimiento de Electron va a ser inferior al que se puede obtener lenguajes que se pueden ejecutar de forma nativa como Swift o C# es particularmente útil para aquellos equipos o empresas que sólo cuentan con experiencia en desarrollo con tecnologias Web.

## Ventajas de Electron

- Mantenibilidad: Al tener un único código para todos los Sistemas Operativos (OS de ahora en más) es más fácil mantenerlo a largo plazo.
- Acceso a APIs nativas
- Amplia comunidad y documentación.

## Desventajas de Electron

- Peor rendimiento: Al no ejecutarse de forma nativa las aplicaciones de Electron pueden consumir más recursos.
- Mayor peso: Al tener que incluir una versión de Chromium y NodeJS con la aplicación esta termina necesitando un mayor almacenamiento del que requeriría si se hicera con otra tecnología.
- Mucho del contenido sobre Electron está en inglés, incluso la documentación no está completamente traducida.

## Aplicaciones Creadas con Electron

Muchas aplicaciones muy conocidas e importantes fueron creadas con Electron, entre las que destacan Discord, VS Code, Trello, Notion y Figma, además que hasta 2022 la aplicación de escritorio de WhatssApp estaba hecha con Electron antes de ser migrada a React Native.

## Recursos para Aprender Electron

- [Documentación oficial](https://www.electronjs.org/docs/latest/): No se encuentra del todo traducida al español.
- [Introduccion a Electron por Midu Dev](https://www.youtube.com/watch?v=ir9yaSgbOdY): Bases de Electron explicadas en Español.
- [Electron con React y TypeScript de freeCodeCamp](https://www.youtube.com/watch?v=fP-371MN0Ck)

## Crear proyecto de Electron

Para crear un proyecto de Electron lo primero es crear el directorio e inicializar un proyecto con npm o yarn

En segundo lugar instalamos la dependencia de desarrollo de Electron con `npm i electron -D` o `yarn add electron -D`.

En tercer lugar es importante crear el archivo `index.js` o `main.js` (según se prefiera) ya que es el punto de entrada de la aplicación de escritorio. Debemos asegurarnos que en el package.json la propiedad `"main"` tenga un valor igual al nombre de archivo del punto de entrada.

Por último tenemos que agregar un script al `package.json` que ejecute `electron .`, por convención `dev`.

## Renderizar Ventanas HTML

Electron otorga un objeto llamado `app` que se encarga de controlar el ciclo de vida de los eventos de la aplicación.

Por otro lado para crear ventanas debemos utilizar la clase `BrowserWindow` de Electron.

Debemos importar ambos de Electron de la siguiente manera

```js
import { app, BrowserWindow } from 'electron'
```

Para renderizar una ventana por lo general vamos a querer hacerlo desde una función que se encargue de crearla, por lo que es lo que vamos a hacer.

```js
const createWindow = () => {
  // ...
}
```

Ahora lo que haremos es crear una instancia de `BrowserWindow` pasandole un objeto que contendrá las opciones de la misma (como las dimesiones)

Y para decir que queremos que la ventana renderice un archivo utilizamos el método `loadFile` y le pasamos el archivo en cuestión.

```js
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  mainWindow.loadFile('index.html')
}
```

Ahora lo que necesitamos es llamar esta función ¿Pero dónde?

Nosotros necesitamos crear la ventana una vez se haya terminado de iniciar Electron, para ello vamos a utilizar el objeto `app`, el cual es capaz de detectar cuándo la aplicación se inició correctamente.

Para ello hay muchas formas pero la más sencilla es utilizando el método `whenReady`, el cual devuelve una promesa que se resuelve cuando la aplicación terminó de iniciarse

```js
app.whenReady().then(() => {
  createWindow()
})
```

De esta forma el código completo quedaría de la siguiente manera:

```js
import { app, BrowserWindow } from 'electron'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})
```

Para ejecutar nuestro proyecto es tan simple como ejecutar el script que configuramos con anterioridad `npm run dev` o `yarn run dev`.

## Procesos en Electron

Si nosotros ejecutamos nuestro ejemplo anterior y abrimos el Administrador de Tareas (TM) o el Monitor de Actividad (AM) y buscamos Electron veremos que hay 4 procesos, a nosotros nos de momento nos interesa diferenciar entre dos procesos, el principar y el de renderizado. Si bien no podemos diferenciarlos facilmente desde el TM o AM la diferencia entre ambos es sencilla.

El proceso principal es único y es el que envuelve al punto de entrada de la aplicación (`main.js`) el cual se ejecuta con NodeJS.

Por otro lado puede haber varios procesos de renderizado diferentes, uno por cada ventana, que son ejecutados con Chromium y son los encargados de gestionar lo que se ve en las ventanas.

Es importante entender esto porque hay muchas ocasiones en las que vamos a querer hacer algo en nuestro proceso principal y que esto afecte a las ventanas pero para ello debemos encargarnos de comunicar los procesos nosotros mismos.

## Terminar Proceso

Es importante saber cómo terminar un proceso desde el código, sobre todo porque en la mayoría de OS, a excepción de MacOS, al cerrar todas las ventanas el proceso principal no se termina.

Para terminar el proceso principal y, por ende, cerrar completamente la aplicación es tan simple como llamar al método `quit()` de `app`.

Para hacer esto cuando se cierran todas las ventanas lo que debemos hacer es detectar el evento `window-all-closed` con el método `on()` de `app` como vemos a continuación:

```js
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // 'darwin' hacer referencia a MacOS
    app.quit()
  }
})
```

Se puede ver todo el código de ejemplo hasta ahora en [project-1](./project-1/)

## Menús Nativos

Un menú nativo hace referencia a la barra de navegación que muchas aplicaciones tienen, como por ejemplo la de VS Code que se ve a continuación:

![VS Code menu image](./images/native-menu-example.png)

Para crear un menú nativos como este nos apoyaremos de la clase `Menu` que nos proporciona Electron. Hay muchas formas de crear un menú con esta clase pero la más sencilla es por medio de una plantilla (template), veremos la estructura de una plantilla un poco más adelante.

Una vez tengamos la platilla usaremos el método estático `buildFromTemplate` de la clase `Menu` pasandole nuestra plantilla como argumento, esto devolverá una instancia de `Menu` basada en nuestra plantilla. Por último usando el método `setApplicationMenu` de `Menu` pasandole la instancia creada por `buildFromTemplate` Electron se encargará de que aparezca en la aplicación

```js
const template = [
  // ...
]

const menu = Menu.buildFromTemplate(template)

Menu.setApplicationMenu(menu)
```

### Plantilla de un Menú

La plantilla de un menú tiene una estructura muy simple, es un Array de objetos que debe cumplir con el tipo `MenuTemplate` que se define a continuación:

```ts
enum Roles {
  'undo', 'redo', 'cut', 'copy', 'paste', 'pasteAndMatchStyle', 'delete', 'selectAll', 'reload',
  'forceReload', 'toggleDevTools', 'resetZoom', 'zoomIn', 'zoomOut', 'toggleSpellChecker',
  'togglefullscreen', 'window', 'minimize', 'close', 'help', 'about', 'services', 'hide', 'hideOthers',
  'unhide', 'quit', 'showSubstitutions', 'toggleSmartQuotes', 'toggleSmartDashes', 'toggleTextReplacement',
  'startSpeaking', 'stopSpeaking', 'zoom', 'front', 'appMenu', 'fileMenu', 'editMenu', 'viewMenu',
  'shareMenu', 'recentDocuments', 'toggleTabBar', 'selectNextTab', 'selectPreviousTab', 'showAllTabs',
  'mergeAllWindows', 'clearRecentDocuments', 'moveTabToNewWindow', 'windowMenu'
}

enum Types {
  'normal', 'separator', 'submenu',
  'checkbox', 'radio'
}

interface MenuItemProps {
  label?: string
  click?: () => void
  role?: Roles
  type?: Types
  enabled?: boolean
}

type MenuItem = MenuItemProps & {
  submenu?: MenuItem[]
}

type MenuTemplate = MenuItem[]
```

Hay más propiedades que puede tener un item de un menú pero aquí están algunas de las más básicas, para ver el resto ir a la [documentación](https://www.electronjs.org/docs/latest/api/menu-item)

Veamos cada una de las propiedades por separado

- label: El texto con el que se mostrará el item.
- click: función que se ejecuta al hacer click en el item.
- role: Los roles hacen referencia a funcionalidades estandar de un menú como lo es por ejemplo un menú de archivo (fileMenu), estos están para que no tengamos que implementarlos manualmente y en general lo mejor es usarlos en la medida de lo posible.
- type: Hace referencia al tipo de botón o elemento que es, un botón `normal`, un separador, un submenú, etc. En caso de que asignemos un submenu no es necesario el tipo "submenu" mientra que en caso de que sea un separador lo normal es no especificar ninguna otra propiedad.
- enabled: si es `false` el item se podrá de color gris y no podremos hacerle clic.
- submenu: Nos permite hacer un menú que se desprenda de ese item.

### Ejemplo de Menú

Suponagamos que queremos un menú con la siguiente estructura

```txt
root -- 
      |-- File
      |     |-- Exit
      |
      |-- View
      |     |-- reload
      |     |-- forceReload
      |     |-- toggleDevTools
      |     |-- togglefullscreen
      |
      |-- Settings
             |---- Langs
             |       |--- English
             |       |--- Spanish
             |
             |---- Themes
                     |--- Light
                     |--- Dark
```

Vayamos apartado por apartados

#### File

La estructura de File es la más simple pero tiene algunos conceptos importantes, vamos primero con el código y después lo explicamos

```js
{
  label: 'File',
  submenu: [
    process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' }
  ]
}
```

El label es simple pero porqué usamos un submenú y porqué dependiendo de si el OS es MacOS o no usamos un rol distinto, bueno veamoslo.

En primer lugar el submenú es para que cuando hagamos click sobre "File" nos muestre la opción de salir/cerrar, además que nos permite que sea más fácil a futuro agregar otras opciones relacionadas.

Por otro lado la diferencia entre los roles `close` y `quit` está en que el primero cierra la ventana mientras que el segundo termina la aplicación, si estamos en MacOS con cerrar la ventana es suficiente porque el OS se encarga de terminar la aplicación si no quedan ventanas (cerrar una ventana requiere menos recursos) pero en otros OS como Windows o Linux esto no siempre ocurre por lo que tenemos que terminar la aplicación nosotros (consume más memoria).

Este menú `File` que creamos es exactamente igual al creado por el rol `fileMenu`

```js
{ role: 'fileMenu' }
```

#### View

En el caso de View no hay nada raro pero tendremos que explicar algunos roles más y el tipo `separator`

```js
{
  label: 'View',
  submenu: [
    { role: 'reload' },
    { role: 'forceReload' },
    { role: 'toggleDevTools' },
    { type: 'separator' },
    { role: 'togglefullscreen' }
  ]
}
```

Roles:
- reload: Recarga la ventana actual.
- forceReload: Recarga la ventana actual ignorando el cache.
- toggleDevTools: Muestra/esconde las herramientas de desarrollo del navegador (recordemos que Electron ejecuta nuestra app en un navegador incorporado).
- togglefullscreen: Alterna el modo de pantalla completa.

Separator: Lo que hace es dibujar una linea para que el usuario entienda qué opciones forman un grupo entre sí sin la necesidad de crear submenú.

Por otro lado este menú `View` es igual al creado por el rol `viewMenu`

```js
{ role: 'viewMenu' }
```

#### Settings

No vamos a hacer funcional las opciones de lenguaje y tema, simplemente veremos un ejemplo de la propiedad `click` de los items de los menús

```js
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
        label: 'Spanish',
        click: () => { console.log('Dark') }
      }
    ]
  }
]
}
```

Por ejemplo, al hacer click en el tema claro se imprimirá en consola el texto "Light".

#### Ejemplo Completo

Hay una cosa más que querriamos hacer y es separar la lógica de creación del menú en un archivo apartado, para hacer eso simplemente hacemos lo siguiente.

```js
// path: ./menu.js
import { Menu } from 'electron'

// Creamos una variable para validar más claramente si el OS es MacOS o no
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
```

Y para crearlo en nuestra aplicación es tan sencillo como importarlo en nuestro punto de entrada y llamar a la función

```js
// path: ./index.js
import { app, BrowserWindow } from 'electron'
import { setupMenu } from './menu.js'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}

setupMenu()

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

## Comunicar Procesos

A la hora de comunicar procesos nos apoyamos del IPC, Inter-Process Communication; este permite enviar eventos desde uno de los procesos de Electron y que el otro los escuche, veamoslo con el ejemplo del tema claro y oscuro.

Como el cambio de tema es algo que ocurre en el menú (proceso principal) nosotros tenemos que emitir el evento desde menu, y escucharlo desde el renderer.

Para hacer esto lo primero es pasarle al menú la ventana en cuestión (veremos por qué más adelante) para lo cual cambiaremos un poco el archivo `index.js`.

```js
// path: index.js
import { app, BrowserWindow } from 'electron'
import { setupMenu } from './menu.js'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')

  setupMenu(win)
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

Ahora nos dirigimos a `menu.js` para realizar los siguientes cambios:

Primero, definir el parametro en la función `setupMenu`

```js
// path: menu.js
export const setupMenu = (win) => {
  // ...
}
```

Segundo, cuando se hace click en una de las opciones de tema usaremos el método `win.webContents.send(eventName, value)` para emitir el evento.

```js
export const setupMenu = (win) => {
  const template = [
    // ...
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Themes',
          submenu: [
            {
              label: 'Light',
              click: () => win.webContents.send('change-theme', 'light') // nombre del evento "change-theme" y se emite con un valor 'light'
            },
            {
              label: 'Dark',
              click: () => win.webContents.send('change-theme', 'dark') // el valor del evento esta vez es 'dark'
            }
          ]
        }
      ]
    }
  ]
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
```

En tercer lugar, para poder escuchar el evento desde nuestro renderer debemos crear un archivo `preload.js` que se ejecutará antes de que se renderice la página, esto nos servirá para poder exponer ciertas constantes o funciones para que toda la aplicación pueda acceder a ellas. Antes de pasar al archivo `preload.js` en sí veremos como especificarle a la ventana que ese archivo debe ejecutarse antes del renderizado.

```js
import { app, BrowserWindow } from 'electron'
import { setupMenu } from './menu.js'
import { join as joinPath } from 'node:path'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: joinPath(__dirname, 'preload.js') // path al archivo
    }
  })

  win.loadFile('index.html')

  setupMenu(win)
}

// ...
```

Ahora sí, en `preload.js` lo que vamos a hacer es crear un **puente de contexto** que permitirá que nuestro renderer pueda acceder a ciertas partes de la API de Electron (por defecto no puede)

```js
// path: preload.js

// En los Preload Scripts no podemos usar Modules, Electron sólo soporta CommonJS
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateTheme: callback => { ipcRenderer.on('change-theme', callback) }
})
```

El método `exposeInMainWorld` hace que toda la aplicación pueda acceder al objeto con el nombre que le especifiquemos, en este caso `'electronAPI'`

Utilizamos `ipcRenderer` porque es el proceso de renderizado el que usará esa función.

Antes de continuar cave aclarar que cuando IPC detecta un evento pasa al callback dos argumentos, el primero es el evento en sí y el segundo es el valor con el que se lanzó, en nuestro caso `'light'` o `'dark'`.

Para usar ese método que creamos nos dirigimos a nuestro renderer y lo utilizamos de la siguiente manera

```js
// path: renderer.js
window.electronAPI.onUpdateTheme((evt, theme) => {
  const root = document.documentElement // obtenemos la raiz del documento (:root en CSS)

  root.style.setProperty('--scheme', theme) // cambiamos una custom property "--scheme" que es la que define el tema de la aplicación
})
```

# Electron, React y TypeScript

Electron es un framework de JS, como tal, es posible usarlo con React y TypeScript (TS de ahora en más) y es lo que veremos a continuación.

Antes de continuar, debido a que `yarn` es más rápido que `npm` usaremos la CLI de `yarn` de ahora en más. 

## Creación del proyecto

### React y TypeScript

Lo primero es crear un proyecto de React y TS con Vite (al cual le agregaremos Electron más adelante), para ello ejecutamos el comando usual

```sh
yarn create vite <projectName>
```

Al no trabajar en una página web el directorio `./public` no nos sirve por lo que lo eliminaremos.

Por otro lado nosotros vamos a querer tener todo el código de la aplicación dentro del directorio `./src` tanto el de React como el de Electron por lo que es recomendable crear dos dentro de este, una para la UI y otro para Electron. Acto seguido moveremos todos los archivos creados por Vite a la carpeta `ui`.

Luego cambiamos nuestro `index.html` para que busque el script `main.tsx` en el lugar correcto.

Después tenemos que cambiar la carpeta en la que Vite compilará nuestra aplicación y la ruta base de la aplicación, lo primero se debe a que por defecto Vite compila en `./dist` pero esto crea conflicto con Electron que también lo hace allí, como Vite es el único de los dos que permite cambiar el directorio de salida es el que debemos configurar, mientras que si no especificamos la ruta base la aplicación intentará buscar algunos archivos partiendo de la raiz del sistema de archivos.

```ts
// path: ./vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // "./" es el directorio en el que se encuentra el archivo
  build: {
    outDir: "dist-react" // podemos pasarle el nombre que queramos
  }
})

```

Recordemos actualizar nuestro `.gitignore` para que este directorio de compilación no sea subido a nuestro repositorio.

### Electron

Para agregar Electron a nuestro proyecto simplemente tenemos que instalarlo y hacer algunas configuraciones como las vistas con anterioridad:

```sh
yarn add electron -D
```

Acto seguido hacemos lo siguiente:

- Creamos un archivo `./src/electron/main.js`
- Hacer que renderice el archivo `./dist-react/index.html` con `path.join(app.getAppPath(), 'dist-react', 'index.html')`
- Configurar el `package.json` para que el script principal sea `./src/electron/main`
- Configurar el `package.json` para tener dos script de desarrollo uno `dev:react` que ejectue solo la UI y otro `dev:electron` que ejecute la aplicación de Electron

### Configurar TypeScript para Electron

Para poder usar TS con electron lo primero es decirle a la configuración de TS creada por Vite en `./tsconfig.app.json` que no valide nuestro código de Electron, esto para que podamos configurarlo correctamente nosotros, para ello agregamos lo siguiente al archivo

```json
// path: ./tsconfig.app.json
{
  // ...
  "exclude": ["src/electron"]
}
```

Ahora podemos ir a `./src/electron` y crear nuestro propio `tsconfig.json` el cual podría llegar a verse parecido a lo siguiente

```json
// path: ./src/electron/tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "target": "ESNext",
    "module": "NodeNext",
    "outDir": "../../dist-electron", // path de salida, en nuestro caso creamos `dist-electron` en la raiz
    "skipLibCheck": true
  }
}
```

tenemos que agreagar `dist-electron/` a nuestro `.gitignore`.

Ahora debemos agregar un nuevo script al `package.json` para transpilar nuestro código de Electron

```json
{
  // ...
  "scripts": {
    // ...
    "transpile:electron": "tsc --project src/electron/tsconfig.json"
  },
  // ...
}
```

Otra cosa que debemos cambiar en el `package.json` cuando vamos a trabajar Electron con TS es el archivo principal de la aplicación, que ahora debe ser `dist-electron/main.js`

```json
{
  // ...
  "main": "dist-electron/main.js",
  // ...
}
```

### Electron Builder

Ahora llegó el momento de configurar cómo se va a empaquetar nuestra aplicación de Electron para que sea instalada.

Para esto tenemos que instalar una dependecia aparte, ya que Electron no incluye un builder dentro de su API, las dos opciones más populares son `Forge`, la que aparece en la documentación, y `electron-builder`.

En estos apuntes usaremos `electron-builder` ya que, aunque no tiene soporte por Electron, es el más configurable y el que posee una documentación más extensa

```sh
yarn add electron-builder -D
```

Para que electron builder pueda funcionar correctamente debemos hacer que yarn use `node_modules` tradicionales sin PnP para lo que agregaremos `nodeLinker: "node-modules"` a nuestro `.yarnrc.yml`.

Ahora, para configurar el empaquetado de nuestra aplicación vamos a crear un archivo `./electron-builder.json` en el que especificaremos toda la configuración de empaquetado, algo como lo siguiente.

```json
// path: ./electron-builder.json
{
  "appId": "com.companyName.applicationName", // es un standard para nombrar la aplicación
  "files": ["dist-electron", "dist-react"], // archivos que se incluiran en la app
  "icon": "./path/to/desktopIcon.png" // idealmente un png de como mínimo 256x256
  "mac": { // configuración de build para MacOS
    "target": "dmg" // compilamos a un .dmg
  },
  "linux": {
    "target": "AppImage",
    "category": "categoryName" // Linux permite categorizar una aplicación (ej: Utility)
  },
  "win": {
    "target": ["portable", "msi"] // para windows se empaqueta un portable y un .msi
  }
}
```

Por último tenemos que agregar los scripts a nuestro `package.json` para hacer en empaquetado completo de la aplicación

```json
{
  // ...
  "scripts": {
    // ...
    "dist:win": "yarn transpile:electron && yarn build && electron-builder --win --x64",
    "dist:mac": "yarn transpile:electron && yarn build && electron-builder --mac --arm64",
    "dist:linux": "yarn transpile:electron && yarn build && electron-builder --linux --x64"
  },
  // ...
}
```

Estos scripts lo que hacen es transpilar el código de Electron a JS normal, compilar nuestro código de React con TS y finalmente hacer la build de nuestra aplicación para Windows, MacOS o Linux dependiendo de cuál script ejecutemos.

En caso de que trabajemos en Windows es recomendable ejecutar estos scripts por primera vez como administrador porque `electron-builder` necesita instalar algunos paquetes.

## Proceso de Desarrollo

Ahora podemos seguir con el desarrollo de nuestra aplicación de la misma forma que lo hariamos con para navegador.

Cuando queramos testear nuestra UI podemos sólo ejecutarla con `yarn dev:react`, si queremos probar nuestra app de Electron completa compilamos nuestra UI con `yarn build`, transpilamos nuestro TS de Electron con `yarn transpile:electron` y ejecutarla con `yarn dev:electron`.