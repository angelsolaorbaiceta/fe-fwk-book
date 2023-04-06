const reducers = {
  'update-current-todo': (state, currentTodo) => ({ // --1--
    ...state,
    currentTodo, // --2--
  }),

  'add-todo': (state) => ({
    ...state,
    currentTodo: '', // --3--
    todos: [...state.todos, state.currentTodo], // --4--
  }),

  'start-editing-todo': (state, idx) => ({ // --5--
    ...state,
    edit: {
      idx,
      original: state.todos[idx], // --6--
      edited: state.todos[idx], // --7--
    },
  }),

  'edit-todo': (state, edited) => ({  // --8--
    ...state,
    edit: { ...state.edit, edited }, // --9--
  }),

  'save-edited-todo': (state) => { 
    const todos = [...state.todos] // --10--
    todos[state.edit.idx] = state.edit.edited // --11--

    return {
      ...state,
      edit: { idx: null, original: null, edited: null }, // --12--
      todos,
    }
  },

  'cancel-editing-todo': (state) => ({ 
    ...state,
    edit: { idx: null, original: null, edited: null }, // --13--
  }),

  'remove-todo': (state, idx) => ({ // --14--
    ...state,
    todos: state.todos.filter((_, i) => i !== idx), // --15--
  }),
}