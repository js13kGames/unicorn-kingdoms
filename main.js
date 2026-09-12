/* main.js */

const content = document.getElementById('content')
const hud = document.getElementById('hud')
const fade = document.getElementById('fade')

const state = {
  name: 'START',
  player: { x: 0, y: 0 },
  completed: 0,
  kingdom: 1,
  rainbows: 0,
  totalRainbows: 0,
}

const settings = {
  sound: true,
  music: true,
  hints: true,
  soundVolume: .7,
  musicVolume: .35,
}

const WIDTH = 7
const HEIGHT = 7

const terrainTemplate = [
  ['🌲', '🌲', '·', '·', '🌲', '🌲', '⛰️'],
  ['🌲', '·', '·', '🌾', '·', '·', '⛰️'],
  ['🌊', '🌊', '·', '🌾', '·', '🌾', '·'],
  ['🌊', '·', '·', '🌾', '·', '·', '·'],
  ['🌊', '·', '🌾', '🌾', '·', '🌲', '🌲'],
  ['·', '·', '·', '🌾', '·', '·', '🌲'],
  ['·', '⛰️', '·', '·', '·', '·', '·']
]

let terrain = terrainTemplate.map(row => row.slice())

let pois = [
  { x: 2, y: 1, name: 'Whispering Woods', target: 3, icon: '🌳', rainbows: 0 },
  { x: 5, y: 3, name: 'Moonlit Vale', target: 6, icon: '🌙', rainbows: 0 },
  { x: 2, y: 5, name: 'Unicorn Citadel', target: 10, icon: '🏰', rainbows: 0 }
]

const encounters = [
  { name: 'Wandering Sorcerer', icon: '🧙', target: 3 },
  { name: 'Bog Goblin', icon: '👹', target: 3 },
  { name: 'Traveling Trickster', icon: '🦹', target: 3 }
]


function setHud() {
  if (state.name === 'MATCH') {
    // stub

  } else if (state.name === 'OVERWORLD') {
    const next = nextPoi()

    hud.innerHTML = `<span>🗺️  Kingdom <strong>${state.kingdom}</strong> · Position: <strong>(${state.player.x}, ${state.player.y})</strong> · 🌈 Total: <strong>${state.totalRainbows}</strong></span>
      <span>${next ? `Next: <strong>${next.name}</strong> (${next.target} 🦄)` : '<strong>Kingdom complete! 🎉</strong>'}</span>`

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
    </div>`

  content.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => handleAction(button.dataset.action))
  })
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
    { action: 'START-GAME', label: 'Start Game' },
    { action: 'ABOUT', label: 'About' },
    { action: 'SETTINGS', label: 'Settings' },
  ]

  
  panel('🦄 UNICORN KINGDOMS', 'Choose your adventure and save the Kingdoms!', buttons, 'menu-screen')
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
    <h2 style="margin-top: 1rem;">HOW TO PLAY</h2>
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
  if (action === 'START-GAME') {
    state.name = 'OVERWORLD'
    state.player.x = 0
    state.player.y = 0
    state.completed = 0
    state.rainbows = 0
    renderOverworld()
  }
}

function nextPoi() {
  return state.completed < pois.length ? pois[state.completed] : null
}

function poiAt(x, y) {
  return pois.findIndex(poi => poi.x === x && poi.y === y)
}

function isBlocked(x, y) {
  return terrain[y][x] === '🌊' || terrain[y][x] === '⛰️'
}

function move(direction) {
  if (state.name !== 'OVERWORLD') return

  const delta = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0]
  }[direction]

  console.log(`move direction: target cell ${ poiAt(state.player.x + delta[0], state.player.y + delta[1]) > -1 ? 'POI' : 'empty' }`)

  moveTo(`${state.player.x + delta[0]},${state.player.y + delta[1]}`)
}

function moveTo(value) {
  if (state.name !== 'OVERWORLD') return

  const [x, y] = value.split(',').map(Number)
  if (Math.abs(x - state.player.x) + Math.abs(y - state.player.y) !== 1) return
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT || isBlocked(x, y)) return
  
  state.player.x = x
  state.player.y = y

  // TODO: save game state to localStorage

  const index = poiAt(x, y)
  if (index === state.completed) {
    // stub: begin a progression match at index
    console.log(`START MATCH AT ${pois[index].name}`)
    renderOverworld()

  } else if (index < 0 && Math.random() < .18) {
    // stub: begin an encounter match
    console.log(`START ENCOUNTER WITH ${ encounters[Math.floor(Math.random() * encounters.length)].name }`)
    renderOverworld()

  } else {
    renderOverworld()
  }
}


function renderOverworld(message = '') {
  state.name = 'OVERWORLD'
 
  let map = ''
 
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const index = poiAt(x, y),
            poi = index >= 0 ? pois[index] : null

      let icon = terrain[y][x], classes = 'tile'
  
      if (poi) {
        icon = index < state.completed ? '✅' : index === state.completed ? poi.icon : '🔒'
        classes += ' poi'
      }
  
      if (x === state.player.x && y === state.player.y) {
        icon = '🦄'
        classes += ' player'
      }
  
      if (!isBlocked(x, y)) {
        classes += ' path'
      }

      const blocked = isBlocked(x, y)
      const label = poi ? `${poi.name}${index < state.completed ? ` · ${poi.rainbows} 🌈` : ''}` : blocked ? 'Blocked terrain' : ''
      map += `<button class="${classes}" data-cell="${x},${y}" ${ label != '' ? `title="${label}"` : '' } ${blocked ? 'disabled' : ''}>${icon}</button>`
    }
  }

  const next = nextPoi()
  const records = pois.filter((poi, index) => index < state.completed).map(poi => `${poi.name}: ${poi.rainbows} 🌈`).join(' · ')

  content.innerHTML = `<div id="map-wrap">
    <h2>✨ Unicorn Kingdoms ✨</h2>
    <p>${message || (next ? `Travel to ${next.name} ${next.icon} and clear ${next.target} unicorns.` : 'Every kingdom has been restored!')}</p>
    <div id="map">${map}</div>
    <div class="controls" aria-label="Map movement">
      <button class="direction" data-move="up">▲</button>
      <button class="direction" data-move="left">◀</button>
      <button class="direction" data-move="down">▼</button>
      <button class="direction" data-move="right">▶</button>
    </div>
    ${records ? `<p>Completed rainbow haul: ${records}</p>` : ''}
    <p>Use Arrow keys, WASD, or click a neighboring cell to travel.</p>
  </div>`

  content.querySelectorAll('[data-move]').forEach(button => button.addEventListener('click', () => {
    move(button.dataset.move)
  }))

  content.querySelectorAll('[data-cell]').forEach(button => button.addEventListener('click', () => {
    moveTo(button.dataset.cell)
  }))

  setHud()
}

window.addEventListener('keydown', event => {
  if (state.name === 'START') {
    showMenu()
    return
  }
  
  if (state.name !== 'OVERWORLD') return
  
  const key = event.key.toLowerCase(),
        direction = {
          arrowup: 'up',
          w: 'up',
          arrowdown: 'down',
          s: 'down',
          arrowleft: 'left',
          a: 'left',
          arrowright: 'right',
          d: 'right'
        }[key]
      
  if (direction) {
    event.preventDefault()
    move(direction)
  }
})

window.addEventListener('pointerdown', event => {
  if (state.name === 'START' && !event.target.closest('button')) {
    showMenu()
  }
})

window.addEventListener('load', () => {
  console.log('loaded.')
  showStart()
})
