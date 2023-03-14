// Initialize the view
for (const todo of todos) { // --1--
  todosList.append(renderTodoInReadMode(todo))
}

addTodoInput.addEventListener('input', () => { // --2--
  addTodoButton.disabled = addTodoInput.value.length < 3
})

addTodoInput.addEventListener('keydown', ({ key }) => { // --3--
  if (key === 'Enter' && addTodoInput.value.length >= 3) {
    addTodo()
  }
})

addTodoButton.addEventListener('click', () => { // --4--
  addTodo()
})

// Functions
function renderTodoInReadMode(todo) {
  // TODO: implement me!
}

function addTodo() {
  // TODO: implement me!
}
