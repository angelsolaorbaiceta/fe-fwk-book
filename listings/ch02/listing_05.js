function renderTodoInEditMode(todo) {
  const li = document.createElement('li')

  const input = document.createElement('input')
  input.type = 'text'
  input.value = todo
  li.append(input)

  const saveBtn = document.createElement('button')
  saveBtn.textContent = 'Save'
  saveBtn.addEventListener('click', () => {
    const idx = todos.indexOf(todo)
    updateTodo(idx, input.value)
  })
  li.append(saveBtn)

  const cancelBtn = document.createElement('button')
  cancelBtn.textContent = 'Cancel'
  cancelBtn.addEventListener('click', () => {
    const idx = todos.indexOf(todo)
    todosList.replaceChild(
      renderTodoInReadMode(todo),
      todosList.childNodes[idx]
    )
  })
  li.append(cancelBtn)

  return li
}
