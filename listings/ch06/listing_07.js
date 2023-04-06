function TodoItem({ todo, i, edit }, emit) {
  const isEditing = edit.idx === i

  return isEditing
    ? h('li', {}, [ // --1--
        h('input', {
          value: edit.edited, // --2--
          on: {
            input: ({ target }) => emit('edit-todo', target.value) // --3--
          },
        }),
        h(
          'button',
          { 
            on: { 
              click: () => emit('save-edited-todo') // --4--
            }
          }, 
          ['Save']
        ),
        h(
          'button',
          {
            on: {
              click: () => emit('cancel-editing-todo') // --5--
            }
          },
          ['Cancel']
        ),
      ])
    : h('li', {}, [ // --6--
        h(
          'span',
          { 
            on: {
              dblclick: () => emit('start-editing-todo', i) // --7--
            }
          },
          [todo] // --8--
        ),
        h(
          'button',
          { 
            on: { 
              click: () => emit('remove-todo', i) // --9-- 
            }
          },
          ['Done']
        ),
      ])
}