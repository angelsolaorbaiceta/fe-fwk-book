import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createApp } from '../app'
import { nextTick } from '../scheduler'
import { App } from './app'
import { singleHtmlLine } from './utils'

/** @type {import('../app').Application} */
let app

beforeEach(() => {
  // stub console.warn to avoid polluting the test output
  vi.stubGlobal('console', { warn: vi.fn(), log: console.log })

  app = createApp(App, { todos: ['Water the plants'] })
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('when the application is mounted', () => {
  afterEach(async () => {
    await nextTick()
    app.unmount()
  })

  test("can't be mounted again", () => {
    app.mount(document.body)
    expect(() => app.mount(document.body)).toThrow()
  })

  test('it shows a loading message', () => {
    app.mount(document.body)
    expect(document.body.innerHTML).toBe(singleHtmlLine`<p>Loading...</p>`)
  })

  test('it is rendered into the parent element', async () => {
    app.mount(document.body)
    await nextTick()

    expect(document.body.innerHTML).toBe(
      singleHtmlLine`
      <h1>Todos</h1>
      <input type="text">
      <button>Add</button>
      <ul>
        <li>
          <span>Water the plants</span>
          <button>Done</button>
        </li>
        <li>
          <span>Walk the dog</span>
          <button>Done</button>
        </li>
      </ul>`
    )
  })
})

describe('when the application is unmounted', () => {
  beforeEach(async () => {
    app.mount(document.body)
    await nextTick()
  })

  test("it can't be unmounted again", () => {
    app.unmount()
    expect(() => app.unmount()).toThrow()
  })

  test('it is removed from the parent element', async () => {
    app.unmount()
    await nextTick()

    expect(document.body.innerHTML).toBe('')
  })
})

describe('when the user adds a todo', () => {
  beforeEach(async () => {
    app.mount(document.body)
    await nextTick()

    writeInInput('Buy milk')
    clickAddButton()

    await nextTick()
  })

  test('renders the new todo in read mode', () => {
    expect(document.body.innerHTML).toBe(
      singleHtmlLine`
        <h1>Todos</h1>
        <input type="text">
        <button>Add</button>
        <ul>
          <li>
            <span>Water the plants</span>
            <button>Done</button>
          </li>
          <li>
            <span>Walk the dog</span>
            <button>Done</button>
          </li>
          <li>
            <span>Buy milk</span>
            <button>Done</button>
          </li>
        </ul>`
    )
  })
})

describe('when the user removes a todo', () => {
  beforeEach(async () => {
    app.mount(document.body)
    await nextTick()

    clickDoneButton(0)
  })

  test('removes the todo from the list', () => {
    expect(document.body.innerHTML).toBe(
      singleHtmlLine`
        <h1>Todos</h1>
        <input type="text">
        <button>Add</button>
        <ul>
          <li>
            <span>Walk the dog</span>
            <button>Done</button>
          </li>
        </ul>`
    )
  })
})

function writeInInput(text) {
  document.querySelector('input').value = text
  document.querySelector('input').dispatchEvent(new Event('input'))
}

function clickAddButton() {
  document.querySelector('button').click()
}

function clickDoneButton(index) {
  document.querySelectorAll('li button')[index].click()
}
