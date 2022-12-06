function renderTodoInReadMode(todo) {
  const li = document.createElement('li')

  const span = document.createElement('span')
  span.textContent = todo
  span.addEventListener('dblclick', () => {
    const idx = todos.indexOf(todo)

    todosList.replaceChild(
      renderTodoInEditMode(todo),
      todosList.childNodes[idx]
    )
  })
  li.append(span)

  const button = document.createElement('button')
  button.textContent = 'Done'
  button.addEventListener('click', () => {
    const idx = todos.indexOf(todo)
    removeTodo(idx)
  })
  li.append(button)

  return li
}

function removeTodo(index) {
  // TODO: implement me!
}
