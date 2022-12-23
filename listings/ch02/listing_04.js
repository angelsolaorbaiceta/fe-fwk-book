function renderTodoInReadMode(todo) {
  const li = document.createElement('li') // --1--

  const span = document.createElement('span') // --2--
  span.textContent = todo
  span.addEventListener('dblclick', () => { // --3--
    const idx = todos.indexOf(todo)

    todosList.replaceChild( // --4--
      renderTodoInEditMode(todo),
      todosList.childNodes[idx]
    )
  })
  li.append(span)

  const button = document.createElement('button') // --5--
  button.textContent = 'Done'
  button.addEventListener('click', () => { // --6--
    const idx = todos.indexOf(todo)
    removeTodo(idx)
  })
  li.append(button)

  return li
}

function removeTodo(index) {
  // TODO: implement me!
}