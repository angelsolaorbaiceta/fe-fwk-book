import {
  createApp,
  defineComponent,
  h,
  hFragment,
} from 'https://unpkg.com/fe-fwk@4'
import { readTodos, writeTodos } from './todos-repository.js'

const App = defineComponent({
  state() {
    return {
      todos: [],
    }
  },

  onMounted() {
    this.updateState({ todos: readTodos() })
  },

  render() {
    const { todos } = this.state

    return hFragment([
      h('h1', {}, ['My TODOs']),
      h(CreateTodo, {
        on: {
          add: this.addTodo,
        },
      }),
      h(TodoList, {
        todos,
        on: {
          remove: this.removeTodo,
          edit: this.editTodo,
        },
      }),
    ])
  },

  addTodo(text) {
    const todo = { id: crypto.randomUUID(), text }
    this.updateState({ todos: [...this.state.todos, todo] })

    writeTodos(this.state.todos)
  },

  removeTodo(idx) {
    const newTodos = [...this.state.todos]
    newTodos.splice(idx, 1)
    this.updateState({ todos: newTodos })

    writeTodos(this.state.todos)
  },

  editTodo({ edited, i }) {
    const newTodos = [...this.state.todos]
    newTodos[i] = { ...newTodos[i], text: edited }
    this.updateState({ todos: newTodos })

    writeTodos(this.state.todos)
  },
})

const CreateTodo = defineComponent({
  state() {
    return { text: '' }
  },

  render() {
    const { text } = this.state

    return h('div', {}, [
      h('label', { for: 'todo-input' }, ['New TODO']),
      h('input', {
        type: 'text',
        id: 'todo-input',
        value: text,
        on: {
          input: ({ target }) => this.updateState({ text: target.value }),
          keydown: ({ key }) => {
            if (key === 'Enter' && text.length >= 3) {
              this.addTodo()
            }
          },
        },
      }),
      h(
        'button',
        {
          disabled: text.length < 3,
          on: { click: this.addTodo },
        },
        ['Add']
      ),
    ])
  },

  addTodo() {
    this.emit('add', this.state.text)
    this.updateState({ text: '' })
  },
})

const TodoList = defineComponent({
  render() {
    const { todos } = this.props

    return h(
      'ul',
      {},
      todos.map((todo, i) =>
        h(TodoItem, {
          key: todo.id,
          todo: todo.text,
          i,
          on: {
            remove: (i) => this.emit('remove', i),
            edit: ({ edited, i }) => this.emit('edit', { edited, i }),
          },
        })
      )
    )
  },
})

const TodoItem = defineComponent({
  state({ todo }) {
    return {
      original: todo,
      edited: todo,
      isEditing: false,
    }
  },

  render() {
    const { isEditing, original, edited } = this.state

    return isEditing
      ? this.renderInEditMode(edited)
      : this.renderInViewMode(original)
  },

  renderInEditMode(edited) {
    return h('li', {}, [
      h('input', {
        value: edited,
        on: {
          input: ({ target }) => this.updateState({ edited: target.value }),
        },
      }),
      h(
        'button',
        {
          on: {
            click: this.saveEdition,
          },
        },
        ['Save']
      ),
      h('button', { on: { click: this.cancelEdition } }, ['Cancel']),
    ])
  },

  saveEdition() {
    this.updateState({ original: this.state.edited, isEditing: false })
    this.emit('edit', { edited: this.state.edited, i: this.props.i })
  },

  cancelEdition() {
    this.updateState({ edited: this.state.original, isEditing: false })
  },

  renderInViewMode(original) {
    return h('li', {}, [
      h(
        'span',
        { on: { dblclick: () => this.updateState({ isEditing: true }) } },
        [original]
      ),
      h(
        'button',
        { on: { click: () => this.emit('remove', this.props.i) } },
        ['Done']
      ),
    ])
  },
})

createApp(App).mount(document.body)
