import { h, hFragment } from '../h'
import { defineComponent } from '../component'

export const App = defineComponent({
  state({ todos = [] }) {
    return { todos }
  },

  render() {
    return hFragment([
      h('h1', {}, ['Todos']),
      h(AddTodo, { on: { addTodo: this.addTodo } }),
      h(TodosList, {
        todos: this.state.todos,
        on: { removeTodo: this.removeTodo },
      }),
    ])
  },

  addTodo(description) {
    this.updateState({
      todos: [...this.state.todos, description],
    })
  },

  removeTodo(index) {
    this.updateState({
      todos: [
        ...this.state.todos.slice(0, index),
        ...this.state.todos.slice(index + 1),
      ],
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
    const { todos } = this.props

    return h(
      'ul',
      {},
      todos.map((description, index) =>
        h(TodoItem, {
          description,
          key: description,
          index,
          on: { removeTodo: (index) => this.emit('removeTodo', index) },
        })
      )
    )
  },
})

const TodoItem = defineComponent({
  render() {
    const { description } = this.props

    return h('li', {}, [
      h('span', {}, [description]),
      h('button', { on: { click: this.removeTodo } }, ['Done']),
    ])
  },

  removeTodo() {
    this.emit('removeTodo', this.props.index)
  },
})
