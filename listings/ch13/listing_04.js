const TodoList = defineComponent({
  render() {
    const { todos } = this.props

    return h(
      'ul',
      {},
      todos.map((todo, i) => // --1--
        h(TodoItem, {
          key: todo.id, // --2--
          todo: todo.text, // --3--
          i, // --4--
          on: {
            remove: (i) => this.emit('remove', i), // --5--
            edit: ({ edited, i }) => this.emit('edit', { edited, i }), // --6--
          },
        })
      )
    )
  },
})