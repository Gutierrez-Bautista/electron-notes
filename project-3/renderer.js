const $btn = document.querySelector('button')
const $counter = document.querySelector('span')

$btn.addEventListener('click', () => {
  const count = +$counter.innerText
  $counter.innerText = count + 1
})

window.electronAPI.onUpdateTheme((evt, theme) => {
  const root = document.documentElement

  root.style.setProperty('--scheme', theme)
})