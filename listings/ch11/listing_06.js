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
        value: edited,
        on: {
          input: ({ target }) => this.updateState({ edited: target.value }),
        },
      }),
      h(
        'button',
        {
          on: {
            click: this.saveEdition,
          },
        },
        ['Save']
      ),
      h('button', { on: { click: this.cancelEdition } }, ['Cancel']),
    ])
    // --add--
  },

  // --add--
  saveEdition() {
    this.updateState({ original: this.state.edited, isEditing: false })
    this.emit('edit', { edited: this.state.edited, i: this.props.i })
  },

  cancelEdition() {
    this.updateState({ edited: this.state.original, isEditing: false })
  },
  // --add--

  renderInViewMode(original) {
    // TODO: implement me
  },
})