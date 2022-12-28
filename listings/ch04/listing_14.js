function CreateTodo({ currentTodo }, emit) {
  return h('div', {}, [
    h('label', { for: 'todo-input' }, [hString('New TODO')]),
    h('input', {
      type: 'text',
      id: 'todo-input',
      value: currentTodo,
      on: {
        input: ({ target }) => emit('update-current-todo', target.value),
      },
    }),
    h(
      'button',
      {
        disabled: currentTodo.length < 3,
        on: { click: () => emit('add-todo') },
      },
      [hString('Add')]
    ),
  ])
}