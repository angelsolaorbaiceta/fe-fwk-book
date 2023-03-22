import { beforeEach, describe, expect, test } from 'vitest'
import { createApp } from '../app'
import { h, hFragment } from '../h'

const state = { count: 0 }

const reducers = {
  decrement: (state) => ({ count: state.count - 1 }),
  increment: (state) => ({ count: state.count + 1 }),
}

function View(state, emit) {
  return hFragment([
    h(
      'button',
      {
        on: { click: () => emit('decrement') },
        'data-qa': 'minus-btn',
      },
      ['-']
    ),
    h('span', {}, [`${state.count}`]),
    h(
      'button',
      {
        on: { click: () => emit('increment') },
        'data-qa': 'plus-btn',
      },
      ['+']
    ),
  ])
}

let app

beforeEach(() => {
  app = createApp({ state, reducers, view: View })
  document.body.innerHTML = ''
})

describe('when the application is mounted', () => {
  beforeEach(() => {
    app.mount(document.body)
  })

  test('it is rendered into the parent element', () => {
    expect(document.body.innerHTML).toBe(
      normalizeLines(`
      <button data-qa="minus-btn">-</button>
      <span>0</span>
      <button data-qa="plus-btn">+</button>`)
    )
  })

  describe('when the user clicks the increment button', () => {
    beforeEach(() => {
      document.querySelector('[data-qa="plus-btn"]').click()
    })

    test('it increments the counter', () => {
      expect(document.body.innerHTML).toBe(
        normalizeLines(`
        <button data-qa="minus-btn">-</button>
        <span>1</span>
        <button data-qa="plus-btn">+</button>`)
      )
    })
  })

  describe('when the user clicks the decrement button', () => {
    beforeEach(() => {
      document.querySelector('[data-qa="minus-btn"]').click()
    })

    test('it decrements the counter', () => {
      expect(document.body.innerHTML).toBe(
        normalizeLines(`
        <button data-qa="minus-btn">-</button>
        <span>-1</span>
        <button data-qa="plus-btn">+</button>`)
      )
    })
  })
})

function normalizeLines(str) {
  return str.replace(/\n/g, '').trim().replace(/>\s+</g, '><')
}
