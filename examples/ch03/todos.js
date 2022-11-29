import { createApp, h, hString, hFragment } from './fe-fwk.js'

const state = {
  currentTodo: '',
  edit: {
    idx: null,
    original: null,
    edited: null,
  },
  todos: ['Walk the dog', 'Water the plants', 'Sand the chairs'],
}

const reducers = {
  'update-current-todo': (state, currentTodo) => ({
    ...state,
    currentTodo,
  }),

  'add-todo': (state) => ({
    ...state,
    currentTodo: '',
    todos: [...state.todos, state.currentTodo],
  }),

  'click-todo': (state, idx) => ({
    ...state,
    edit: {
      idx,
      original: state.todos[idx],
      edited: state.todos[idx],
    },
  }),

  'edit-todo': (state, edited) => ({
    ...state,
    edit: { ...state.edit, edited },
  }),

  'save-edited-todo': (state) => {
    const todos = [...state.todos]
    todos[state.edit.idx] = state.edit.edited

    return {
      ...state,
      edit: { idx: null, original: null, edited: null },
      todos,
    }
  },

  'cancel-edit': (state) => ({
    ...state,
    edit: { idx: null, original: null, edited: null },
  }),

  'remove-todo': (state, idx) => ({
    ...state,
    todos: state.todos.filter((_, i) => i !== idx),
  }),
}

function App(state, emit) {
  return hFragment([
    h('h1', {}, [hString('My TODOs')]),
    CreateTodo(state, emit),
    TodoList(state, emit),
  ])
}

function CreateTodo({ currentTodo }, emit) {
  return h('div', {}, [
    h('label', { for: 'todo-input' }, [hString('New TODO')]),
    h('input', {
      type: 'text',
      id: 'todo-input',
      value: currentTodo,
      on: {
        input: ({ target }) => emit('update-current-todo', target.value),
      },
    }),
    h(
      'button',
      {
        disabled: currentTodo.length < 3,
        on: { click: () => emit('add-todo') },
      },
      [hString('Add')]
    ),
  ])
}

function TodoList({ todos, edit }, emit) {
  return h(
    'ul',
    {},
    todos.map((todo, i) => TodoItem({ todo, i, edit }, emit))
  )
}

function TodoItem({ todo, i, edit }, emit) {
  const isEditing = edit.idx === i

  return isEditing
    ? h('li', {}, [
        h('input', {
          value: todo,
          on: { input: (e) => emit('edit-todo', e.target.value) },
        }),
        h('button', { on: { click: () => emit('save-edited-todo') } }, [
          hString('Save'),
        ]),
        h('button', { on: { click: () => emit('cancel-edit') } }, [
          hString('Cancel'),
        ]),
      ])
    : h('li', {}, [
        h('span', { on: { dblclick: () => emit('click-todo', i) } }, [
          hString(todo),
        ]),
        h('button', { on: { click: () => emit('remove-todo', i) } }, [
          hString('Done'),
        ]),
      ])
}

createApp({ state, reducers, view: App }).mount(document.body)
