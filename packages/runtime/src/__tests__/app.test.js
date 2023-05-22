import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { createApp } from '../app'
import { App } from './app'
import { singleHtmlLine } from './utils'

/** @type {import('../app').Application} */
let app

beforeEach(() => {
  app = createApp(App, { todos: ['Water the plants', 'Walk the dog'] })
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('when the application is mounted', () => {
  beforeEach(() => {
    app.mount(document.body)
  })

  test('it is rendered into the parent element', () => {
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

  describe('when the application is unmounted', () => {
    beforeEach(() => {
      app.unmount()
    })

    test('it is removed from the parent element', () => {
      expect(document.body.innerHTML).toBe('')
    })
  })

  describe('when the user adds a todo', () => {
    beforeEach(() => {
      writeInInput('Buy milk')
      clickAddButton()
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
    beforeEach(() => {
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
