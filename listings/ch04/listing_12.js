const reducers = {
  'update-current-todo': (state, currentTodo) => ({ // --1--
    ...state,
    currentTodo,
  }),

  'add-todo': (state) => ({ // --2--
    ...state,
    currentTodo: '',
    todos: [...state.todos, state.currentTodo],
  }),

  'start-editing-todo': (state, idx) => ({ // --3--
    ...state,
    edit: {
      idx,
      original: state.todos[idx],
      edited: state.todos[idx],
    },
  }),

  'edit-todo': (state, edited) => ({ // --4--
    ...state,
    edit: { ...state.edit, edited },
  }),

  'save-edited-todo': (state) => { // --5--
    const todos = [...state.todos]
    todos[state.edit.idx] = state.edit.edited

    return {
      ...state,
      edit: { idx: null, original: null, edited: null },
      todos,
    }
  },

  'cancel-editing-todo': (state) => ({ // --6--
    ...state,
    edit: { idx: null, original: null, edited: null },
  }),

  'remove-todo': (state, idx) => ({ // --7--
    ...state,
    todos: state.todos.filter((_, i) => i !== idx),
  }),
}