export function readTodos() {
  return JSON.parse(localStorage.getItem('todos') || '[]')
}

export function writeTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos))
}
