// State of the app
const state = {
  todos: ['Walk the dog', 'Water the plants', 'Sand the chairs'],
  editingTodoIdx: null,
}

// HTML element references
const addTodoInput = document.getElementById('todo-input')
const addTodoButton = document.getElementById('add-todo-btn')
const todosList = document.getElementById('todos-list')

// Functions
function renderTodoInReadMode(todo) {
  const li = document.createElement('li')

  const span = document.createElement('span')
  span.textContent = todo
  span.addEventListener('dblclick', () => {
    const idx = state.todos.indexOf(todo)
    state.editingTodoIdx = idx

    todosList.replaceChild(
      renderTodoInEditMode(todo),
      todosList.childNodes[idx]
    )
  })
  li.appendChild(span)

  const button = document.createElement('button')
  button.textContent = 'Done'
  button.addEventListener('click', () => {
    const idx = state.todos.indexOf(todo)
    removeTodo(idx)
  })
  li.appendChild(button)

  return li
}

function renderTodoInEditMode(todo) {
  const li = document.createElement('li')

  const input = document.createElement('input')
  input.value = todo
  li.appendChild(input)

  const saveBtn = document.createElement('button')
  saveBtn.textContent = 'Save'
  saveBtn.addEventListener('click', () => {
    const idx = state.todos.indexOf(todo)
    updateTodo(idx, input.value)
    state.editingTodoIdx = null
  })
  li.appendChild(saveBtn)

  const cancelBtn = document.createElement('button')
  cancelBtn.textContent = 'Cancel'
  cancelBtn.addEventListener('click', () => {
    const idx = state.todos.indexOf(todo)
    state.editingTodoIdx = null
    todosList.replaceChild(
      renderTodoInReadMode(todo),
      todosList.childNodes[idx]
    )
  })
  li.appendChild(cancelBtn)

  return li
}

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

// Initialize the view
for (const todo of state.todos) {
  todosList.appendChild(renderTodoInReadMode(todo))
}

addTodoInput.addEventListener('input', () => {
  addTodoButton.disabled = addTodoInput.value.length < 3
})

addTodoButton.addEventListener('click', () => {
  addTodo(addTodoInput.value)
  addTodoInput.value = ''
})
