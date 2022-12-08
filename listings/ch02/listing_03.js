// Initialize the view
for (const todo of todos) {
  todosList.append(renderTodoInReadMode(todo))
}

addTodoInput.addEventListener('input', () => {
  addTodoButton.disabled = addTodoInput.value.length < 3
})

addTodoInput.addEventListener('keydown', ({ key }) => {
  if (key === 'Enter') {
    addTodo()
  }
})

addTodoButton.addEventListener('click', () => {
  addTodo()
})

// Functions
function renderTodoInReadMode(todo) {
  // TODO: implement me!
}

function addTodo() {
  // TODO: implement me!
}
