/* main.js */

const content = document.getElementById('content')
const hud = document.getElementById('hud')
const fade = document.getElementById('fade')

const state = {
  name: 'START'
}

const settings = {
  sound: true,
  music: true,
  hints: true,
  soundVolume: .7,
  musicVolume: .35,
}

function setHud() {
  if (state.name === 'MATCH') {
    // stub

  } else if (state.name === 'OVERWORLD') {
    // stub

  } else {
    hud.innerHTML = ''
  }

  hud.classList.toggle('hidden', !['MATCH', 'OVERWORLD'].includes(state.name))
}


function panel(title, text, buttons, className = '') {
  content.innerHTML = `
    <div id="screen" class="title-screen ${className}">
      <h1><span>${title}</span></h1>
      <p>${text}</p>
      <div class="button-row">
        ${buttons.map(button => `
          <button class="action" data-action="${button.action}">
            ${button.label}
          </button>`).join('')}
      </div>
    </div>`;

  content.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => handleAction(button.dataset.action));
  });
}

function showStart() {
  state.name = 'START'

  panel('🦄 UNICORN KINGDOMS', 'Restore the kingdom by visiting each point of interest and collecting Unicorns.', [
    { action: 'MENU', label: 'Continue' }
  ], 'start-screen')

  setHud()
}

function showMenu() {
  state.name = 'MENU'
  
  const buttons = [
    { action: 'START-GAME', label: 'Start Game' }
  ]

  buttons.push({ action: 'ABOUT', label: 'About' }, { action: 'SETTINGS', label: 'Settings' })
  
  panel('🦄 UNICORN KINGDOMS', 'Choose your adventure, save the kingdoms!', buttons, 'menu-screen')
  setHud()
}

function showSettings() {
  state.name = 'SETTINGS'

  content.innerHTML = `<div id="screen" class="title-screen settings-screen">
    <h1><span>🦄 UNICORN KINGDOMS</span></h1>
    <h2>SETTINGS</h2>
    <p>Adjust sound, music, and match hints.</p>
    <p><label><input id="hint-toggle" type="checkbox" ${settings.hints ? 'checked' : ''}> Show hints</label></p>
    <p><label><input id="sound-toggle" type="checkbox" ${settings.sound ? 'checked' : ''}> Sound effects</label><input id="sound-volume" type="range" min="0" max="100" value="${settings.soundVolume * 100}"></p>
    <p><label><input id="music-toggle" type="checkbox" ${settings.music ? 'checked' : ''}> Music</label><input id="music-volume" type="range" min="0" max="100" value="${settings.musicVolume * 100}"></p>
    <div class="button-row">
      <button class="action" data-action="MENU">Back to Menu</button>
    </div>
  </div>`
  
  setTimeout(() => {
    ['hint-toggle','sound-toggle','music-toggle','sound-volume','music-volume'].forEach(
      id => content.querySelector('#' + id).onchange =
      content.querySelector('#' + id).oninput =
      event => {
        const key = id.replace('-toggle','').replace('-volume','Volume')
        settings[key] = id.includes('volume') ? event.target.value / 100 : event.target.checked
      }
    )
  }, 0)

  content.querySelector('[data-action="MENU"]').onclick = showMenu

  setHud()
}

function showAbout() {
  state.name = 'ABOUT'

  content.innerHTML = `<div id="screen" class="title-screen about-screen">
    <h1><span>🦄 UNICORN KINGDOMS</span></h1>
    <h2>ABOUT</h2>
    <p>Unicorn Kingdoms is a js13k 2026 entry.</p>
    <h2>HOW TO PLAY</h2>
    <p>TBD</p>
    <div class="button-row">
      <button class="action" data-action="MENU">Back to Menu</button>
    </div>
  </div>`

  content.querySelector('[data-action="MENU"]').addEventListener('click', showMenu)
  setHud()
}

function handleAction(action) {
  if (action === 'MENU') showMenu()
  if (action === 'ABOUT') showAbout()
  if (action === 'SETTINGS') showSettings()
}

window.addEventListener('load', () => {
  console.log('loaded.')
  showStart()
})
