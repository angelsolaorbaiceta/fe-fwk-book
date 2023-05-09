import { createApp, h, hFragment } from 'https://unpkg.com/fe-fwk@1'
import { makeInitialState, markReducer } from './game.js'

function View(state, emit) {
  return hFragment([Header(state), Board(state, emit)])
}

function Header(state) {
  if (state.winner) {
    return h('h3', { class: 'win-title' }, [`Player ${state.winner} wins!`])
  }

  if (state.draw) {
    return h('h3', { class: 'draw-title' }, [`It's a draw!`])
  }

  return h('h3', {}, [`It's ${state.player}'s turn!`])
}

function Board(state, emit) {
  const freezeBoard = state.winner || state.draw

  return h('table', { class: freezeBoard ? 'frozen' : '' }, [
    h(
      'tbody',
      {},
      state.board.map((row, i) => Row({ row, i }, emit))
    ),
  ])
}

function Row({ row, i }, emit) {
  return h(
    'tr',
    {},
    row.map((cell, j) => Cell({ cell, i, j }, emit))
  )
}

function Cell({ cell, i, j }, emit) {
  const mark = cell
    ? h('span', { class: 'cell-text' }, [cell])
    : h(
        'div',
        {
          class: 'cell',
          on: { click: () => emit('mark', { row: i, col: j }) },
        },
        []
      )

  return h('td', {}, [mark])
}

createApp({
  state: makeInitialState(),
  reducers: {
    mark: markReducer,
  },
  view: View,
}).mount(document.body)
