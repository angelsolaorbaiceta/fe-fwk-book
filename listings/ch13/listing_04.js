const TodoList = defineComponent({
  render() {
    const { todos } = this.props

    return h(
      'ul',
      {},
      todos.map((todo, i) =>
        h(TodoItem, {
          key: todo.replaceAll(' ', '-'),
          todo,
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