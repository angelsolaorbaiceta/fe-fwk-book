// State of the app
const state = {
  todos: ['Walk the dog', 'Water the plants', 'Sand the chairs'],
  editingTodoIdx: null,
}

// HTML element references
const addTodoInput = document.getElementById('todo-input')
const addTodoButton = document.getElementById('add-todo-btn')
const todosList = document.getElementById('todos-list')

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
  addTodoButton.disabled = true
})

// Functions
function renderTodoInReadMode(todo) {
  // TODO: implement me!
}

function addTodo(description) {
  // TODO: implement me!
}
