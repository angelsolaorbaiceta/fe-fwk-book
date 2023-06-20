const App = defineComponent({
  state() {
    return {
      todos: ['Walk the dog', 'Water the plants', 'Sand the chairs'],
    }
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
    this.updateState({ todos: [...this.state.todos, text] })
  },

  removeTodo(idx) {
    const newTodos = [...this.state.todos]
    newTodos.splice(idx, 1)
    this.updateState({ todos: newTodos })
  },

  editTodo({ edited, i }) {
    const newTodos = [...this.state.todos]
    newTodos[i] = edited
    this.updateState({ todos: newTodos })
  },
})