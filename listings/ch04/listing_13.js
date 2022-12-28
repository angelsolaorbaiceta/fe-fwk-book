function App(state, emit) {
  return hFragment([
    h('h1', {}, [hString('My TODOs')]),
    CreateTodo(state, emit),
    TodoList(state, emit),
  ])
}