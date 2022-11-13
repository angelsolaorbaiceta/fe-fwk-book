function renderTodoInReadMode(todo) {
  const li = document.createElement('li')

  const span = document.createElement('span')
  span.textContent = todo
  span.addEventListener('dblclick', () => {
    const idx = state.todos.indexOf(todo)
    state.editingTodoIdx = idx

    todosList.replaceChild(
      renderTodoInEditMode(todo),
      todosList.childNodes[idx]
    )
  })
  li.appendChild(span)

  const button = document.createElement('button')
  button.textContent = 'Done'
  button.addEventListener('click', () => {
    const idx = state.todos.indexOf(todo)
    removeTodo(idx)
  })
  li.appendChild(button)

  return li
}
