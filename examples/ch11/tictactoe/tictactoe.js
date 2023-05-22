import {
  createApp,
  h,
  hFragment,
  defineComponent,
} from 'https://unpkg.com/fe-fwk@3'
import { makeInitialState, markReducer } from './game.js'

const View = defineComponent({
  state() {
    return makeInitialState()
  },

  render() {
    const { winner, draw, player, board } = this.state

    return hFragment([
      h(Header, { winner, draw, player }),
      h(Board, {
        board,
        winner,
        draw,
        on: {
          mark: ({ row, col }) => {
            console.log(`Player ${player} marked (${row}, ${col})`)
            const newState = markReducer(this.state, { row, col })
            this.updateState(newState)
          },
        },
      }),
    ])
  },
})

const Header = defineComponent({
  render() {
    const { winner, draw, player } = this.props

    if (winner) {
      return h('h3', { class: 'win-title' }, [`Player ${winner} wins!`])
    }

    if (draw) {
      return h('h3', { class: 'draw-title' }, [`It's a draw!`])
    }

    return h('h3', {}, [`It's ${player}'s turn!`])
  },
})

const Board = defineComponent({
  render() {
    const freezeBoard = this.props.winner || this.props.draw

    return h('table', { class: freezeBoard ? 'frozen' : '' }, [
      h(
        'tbody',
        {},
        this.props.board.map((row, i) =>
          h(Row, {
            row,
            i,
            on: { mark: (payload) => this.emit('mark', payload) },
          })
        )
      ),
    ])
  },
})

const Row = defineComponent({
  render() {
    const { row, i } = this.props

    return h(
      'tr',
      {},
      row.map((cell, j) =>
        h(Cell, {
          cell,
          i,
          j,
          on: { mark: (payload) => this.emit('mark', payload) },
        })
      )
    )
  },
})

const Cell = defineComponent({
  render() {
    const { cell, i, j } = this.props

    const mark = cell
      ? h('span', { class: 'cell-text' }, [cell])
      : h(
          'div',
          {
            class: 'cell',
            on: { click: () => this.emit('mark', { row: i, col: j }) },
          },
          []
        )

    return h('td', {}, [mark])
  },
})

createApp(View).mount(document.body)
