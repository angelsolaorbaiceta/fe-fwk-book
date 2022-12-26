function renderTodoInEditMode(todo) {
  const li = document.createElement('li') // --1--

  const input = document.createElement('input') // --2--
  input.type = 'text'
  input.value = todo
  li.append(input)

  const saveBtn = document.createElement('button') // --3--
  saveBtn.textContent = 'Save'
  saveBtn.addEventListener('click', () => { // --4--
    const idx = todos.indexOf(todo)
    updateTodo(idx, input.value)
  })
  li.append(saveBtn)

  const cancelBtn = document.createElement('button') // --5--
  cancelBtn.textContent = 'Cancel'
  cancelBtn.addEventListener('click', () => { // --6--
    const idx = todos.indexOf(todo)
    todosList.replaceChild( //--7--
      renderTodoInReadMode(todo),
      todosList.childNodes[idx]
    )
  })
  li.append(cancelBtn)

  return li
}

function updateTodo(index, description) {
  // TODO: implement me!
}
