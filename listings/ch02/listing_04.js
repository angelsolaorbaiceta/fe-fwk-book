function renderTodoInEditMode(todo) {
  const li = document.createElement('li')

  const input = document.createElement('input')
  input.value = todo
  input.type = 'text'
  li.appendChild(input)

  const saveBtn = document.createElement('button')
  saveBtn.textContent = 'Save'
  saveBtn.addEventListener('click', () => {
    const idx = state.todos.indexOf(todo)
    updateTodo(idx, input.value)
    state.editingTodoIdx = null
  })
  li.appendChild(saveBtn)

  const cancelBtn = document.createElement('button')
  cancelBtn.textContent = 'Cancel'
  cancelBtn.addEventListener('click', () => {
    const idx = state.todos.indexOf(todo)
    state.editingTodoIdx = null
    todosList.replaceChild(
      renderTodoInReadMode(todo),
      todosList.childNodes[idx]
    )
  })
  li.appendChild(cancelBtn)

  return li
}
