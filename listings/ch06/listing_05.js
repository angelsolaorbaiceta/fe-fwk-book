function CreateTodo({ currentTodo }, emit) { // --1--
  return h('div', {}, [
    h('label', { for: 'todo-input' }, ['New TODO']), // --2--
    h('input', {
      type: 'text',
      id: 'todo-input',
      value: currentTodo, // --3--
      on: {
        input: ({ target }) => emit('update-current-todo', target.value), // --4--
        keydown: ({ key }) => { 
          if (key === 'Enter' && currentTodo.length >= 3) { // --5--
            emit('add-todo') // --6--
          }
        },
      },
    }),
    h(
      'button',
      {
        disabled: currentTodo.length < 3, // --7--
        on: { click: () => emit('add-todo') }, // --8--
      },
      ['Add']
    ),
  ])
}