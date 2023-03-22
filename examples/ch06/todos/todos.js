import { createApp, h, hFragment } from 'https://unpkg.com/fe-fwk@1'

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

  'start-editing-todo': (state, idx) => ({
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

  'cancel-editing-todo': (state) => ({
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
    h('h1', {}, ['My TODOs']),
    CreateTodo(state, emit),
    TodoList(state, emit),
  ])
}

function CreateTodo({ currentTodo }, emit) {
  return h('div', {}, [
    h('label', { for: 'todo-input' }, ['New TODO']),
    h('input', {
      type: 'text',
      id: 'todo-input',
      value: currentTodo,
      on: {
        input: ({ target }) => emit('update-current-todo', target.value),
        keydown: ({ key }) => {
          if (key === 'Enter' && currentTodo.length >= 3) {
            emit('add-todo')
          }
        },
      },
    }),
    h(
      'button',
      {
        disabled: currentTodo.length < 3,
        on: { click: () => emit('add-todo') },
      },
      ['Add']
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
          value: edit.edited,
          on: { input: ({ target }) => emit('edit-todo', target.value) },
        }),
        h('button', { on: { click: () => emit('save-edited-todo') } }, [
          'Save',
        ]),
        h('button', { on: { click: () => emit('cancel-editing-todo') } }, [
          'Cancel',
        ]),
      ])
    : h('li', {}, [
        h(
          'span',
          { on: { dblclick: () => emit('start-editing-todo', i) } },
          [todo]
        ),
        h('button', { on: { click: () => emit('remove-todo', i) } }, [
          'Done',
        ]),
      ])
}

createApp({ state, reducers, view: App }).mount(document.body)
