function addTodo() { // --1--
  const description = addTodoInput.value

  todos.push(description)
  const todo = renderTodoInReadMode(description)
  todosList.append(todo)

  addTodoInput.value = ''
  addTodoButton.disabled = true
}

function removeTodo(index) { // --2--
  todos.splice(index, 1)
  todosList.childNodes[index].remove()
}

function updateTodo(index, description) { // --3--
  todos[index] = description
  const todo = renderTodoInReadMode(description)
  todosList.replaceChild(todo, todosList.childNodes[index])
}
