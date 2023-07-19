const TodoItem = defineComponent({
  state({ todo }) {
    // --snip-- //
  },

  render() {
    // --snip-- //
  },

  renderInEditMode(edited) {
    // --add--
    return h('li', {}, [
      h('input', {
        value: edited, // --1--
        on: {
          input: ({ target }) =>
            this.updateState({ edited: target.value }), // --2--
        },
      }),
      h(
        'button',
        {
          on: {
            click: this.saveEdition, // --3--
          },
        },
        ['Save']
      ),
      h('button', { on: { click: this.cancelEdition } }, ['Cancel']), // --4--
    ])
    // --add--
  },

  // --add--
  saveEdition() {
    this.updateState({ original: this.state.edited, isEditing: false }) // --5--
    this.emit('edit', { edited: this.state.edited, i: this.props.i }) // --6--
  },

  cancelEdition() {
    this.updateState({ edited: this.state.original, isEditing: false }) // --7--
  },
  // --add--

  renderInViewMode(original) {
    // TODO: implement me
  },
})