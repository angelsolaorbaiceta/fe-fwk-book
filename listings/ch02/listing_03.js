// Initialize the view
for (const todo of todos) {
  todosList.append(renderTodoInReadMode(todo))
}

addTodoInput.addEventListener('input', () => {
  addTodoButton.disabled = addTodoInput.value.length < 3
})

addTodoInput.addEventListener('keydown', ({ key }) => {
  if (key === 'Enter') {
    addTodo(addTodoInput.value)
    addTodoInput.value = ''
    addTodoButton.disabled = true
  }
})

addTodoButton.addEventListener('click', () => {
  addTodo(addTodoInput.value)
  addTodoInput.value = ''
  addTodoButton.disabled = true
})

// Functions
function renderTodoInReadMode(todo) {
  // TODO: implement me!
}

function addTodo(description) {
  // TODO: implement me!
}
