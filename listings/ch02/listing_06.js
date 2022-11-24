function addTodo(description) {
  const idx = todos.push(description) - 1
  const todo = renderTodoInReadMode(description)
  todosList.appendChild(todo)
}

function removeTodo(index) {
  todos.splice(index, 1)
  todosList.removeChild(todosList.childNodes[index])
}

function updateTodo(index, description) {
  todos[index] = description
  const todo = renderTodoInReadMode(description)
  todosList.replaceChild(todo, todosList.childNodes[index])
}
