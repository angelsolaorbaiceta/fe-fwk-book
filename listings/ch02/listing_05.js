function addTodo(description) {
  const idx = state.todos.push(description) - 1
  const todo = renderTodoInReadMode(description)
  todosList.appendChild(todo)
}

function removeTodo(index) {
  state.todos.splice(index, 1)
  todosList.removeChild(todosList.childNodes[index])
}

function updateTodo(index, description) {
  state.todos[index] = description
  const todo = renderTodoInReadMode(description)
  todosList.replaceChild(todo, todosList.childNodes[index])
}
