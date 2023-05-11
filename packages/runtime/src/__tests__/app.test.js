import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { createApp } from '../app'
import { h, hFragment } from '../h'
import { defineComponent } from '../component'
import { singleHtmlLine } from './utils'

const App = defineComponent({
  state({ todos = [] }) {
    return { todos }
  },

  render() {
    return hFragment([
      h('h1', {}, ['Todos']),
      h(AddTodo, { on: { addTodo: this.addTodo } }),
      h(TodosList, { todos: this.state.todos }),
    ])
  },

  addTodo(description) {
    this.updateState({
      todos: [...this.state.todos, description],
    })
  },
})

const AddTodo = defineComponent({
  state() {
    return {
      description: '',
    }
  },

  render() {
    return hFragment([
      h('input', {
        type: 'text',
        value: this.state.description,
        on: { input: this.updateDescription },
      }),
      h('button', { on: { click: this.addTodo } }, ['Add']),
    ])
  },

  updateDescription({ target }) {
    this.updateState({ description: target.value })
  },

  addTodo() {
    this.emit('addTodo', this.state.description)
    this.updateState({ description: '' })
  },
})

const TodosList = defineComponent({
  render() {
    return h(
      'ul',
      {},
      this.props.todos.map((description) => h('li', {}, [description]))
    )
  },
})

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
        <li>Water the plants</li>
        <li>Walk the dog</li>
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

    test('renders the new todo', () => {
      expect(document.body.innerHTML).toBe(
        singleHtmlLine`
        <h1>Todos</h1>
        <input type="text">
        <button>Add</button>
        <ul>
          <li>Water the plants</li>
          <li>Walk the dog</li>
          <li>Buy milk</li>
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
