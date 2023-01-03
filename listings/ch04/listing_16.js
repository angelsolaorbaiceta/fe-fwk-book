function TodoItem({ todo, i, edit }, emit) {
  const isEditing = edit.idx === i

  return isEditing
    ? h('li', {}, [ // --1--
        h('input', {
          value: edit.edited,
          on: { input: ({ target }) => emit('edit-todo', target.value) },
        }),
        h('button', { on: { click: () => emit('save-edited-todo') } }, [
          'Save',
        ]),
        h('button', { on: { click: () => emit('cancel-editing-todo') } }, [
          'Cancel',
        ]),
      ])
    : h('li', {}, [ // --2--
        h(
          'span',
          { on: { dblclick: () => emit('start-editing-todo', i) } },
          [todo]
        ),
        h('button', { on: { click: () => emit('remove-todo', i) } }, [
          'Done',
        ]),
      ])
}