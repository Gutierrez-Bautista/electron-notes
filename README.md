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
  const window = new BrowserWindow({
    width: 800,
    height: 600
  })

  window.loadFile('index.html')
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
