const App = defineComponent({
  state() {
    return {
      todos: [ // --1--
        { id: crypto.randomUUID(), text: 'Walk the dog' },
        { id: crypto.randomUUID(), text: 'Water the plants' },
        { id: crypto.randomUUID(), text: 'Sand the chairs' },
      ],
    }
  },

  render() {
    const { todos } = this.state

    return hFragment([
      h('h1', {}, ['My TODOs']),
      h(CreateTodo, { // --2--
        on: {
          add: this.addTodo, // --3--
        },
      }),
      h(TodoList, { // --4--
        todos, // --5--
        on: {
          remove: this.removeTodo, // --6--
          edit: this.editTodo, // --7--
        },
      }),
    ])
  },

  addTodo(text) { // --8--
    const todo = { id: crypto.randomUUID(), text }
    this.updateState({ todos: [...this.state.todos, todo] })
  },

  removeTodo(idx) { // --9--
    const newTodos = [...this.state.todos]
    newTodos.splice(idx, 1)
    this.updateState({ todos: newTodos })
  },

  editTodo({ edited, i }) { // --10-- 
    const newTodos = [...this.state.todos]
    newTodos[i] = { ...newTodos[i], text: edited }
    this.updateState({ todos: newTodos })
  },
})