const TodoItem = defineComponent({
  state({ todo }) {
    return {
      original: todo,
      edited: todo,
      isEditing: false,
    }
  },

  render() {
    const { isEditing, original, edited } = this.state

    return isEditing
      ? this.renderInEditMode(edited)
      : this.renderInViewMode(original)
  },

  renderInEditMode(edited) {
    // TODO: implement me
  },

  renderInViewMode(original) {
    // TODO: implement me
  },
})