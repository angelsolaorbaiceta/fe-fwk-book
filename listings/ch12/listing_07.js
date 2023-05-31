const TodoItem = defineComponent({
  state({ todo }) {
    // --snip-- //
  },

  render() {
    // --snip-- //
  },

  renderInEditMode(edited) {
    // --snip-- //
  },

  saveEdition() {
    this.updateState({ original: this.state.edited, isEditing: false })
    this.emit('edit', { edited: this.state.edited, i: this.props.i })
  },

  cancelEdition() {
    this.updateState({ edited: this.state.original, isEditing: false })
  },

  renderInViewMode(original) {
    // --add--
    return h('li', {}, [
      h(
        'span',
        { on: { dblclick: () => this.updateState({ isEditing: true }) } },
        [original]
      ),
      h(
        'button',
        { on: { click: () => this.emit('remove', this.props.i) } },
        ['Done']
      ),
    ])
    // --add--
  },
})