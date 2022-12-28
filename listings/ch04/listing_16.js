function TodoItem({ todo, i, edit }, emit) {
  const isEditing = edit.idx === i

  return isEditing
    ? h('li', {}, [ // --1--
        h('input', {
          value: todo,
          on: { input: (e) => emit('edit-todo', e.target.value) },
        }),
        h('button', { on: { click: () => emit('save-edited-todo') } }, [
          hString('Save'),
        ]),
        h('button', { on: { click: () => emit('cancel-editing-todo') } }, [
          hString('Cancel'),
        ]),
      ])
    : h('li', {}, [ // --2--
        h(
          'span',
          { on: { dblclick: () => emit('start-editing-todo', i) } },
          [hString(todo)]
        ),
        h('button', { on: { click: () => emit('remove-todo', i) } }, [
          hString('Done'),
        ]),
      ])
}