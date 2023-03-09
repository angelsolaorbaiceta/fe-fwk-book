function TodoList({ todos, edit }, emit) {
  return h(
    'ul',
    {},
    todos.map((todo, i) => TodoItem({ todo, i, edit }, emit))
  )
}