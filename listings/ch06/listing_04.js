function App(state, emit) {
  return hFragment([
    h('h1', {}, ['My TODOs']),
    CreateTodo(state, emit),
    TodoList(state, emit),
  ])
}