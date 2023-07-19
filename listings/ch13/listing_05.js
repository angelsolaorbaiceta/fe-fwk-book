const TodoItem = defineComponent({
  state({ todo }) {
    return {
      original: todo, // --1--
      edited: todo, // --2--
      isEditing: false, // --3--
    }
  },

  render() {
    const { isEditing, original, edited } = this.state

    return isEditing 
      ? this.renderInEditMode(edited) // --4--
      : this.renderInViewMode(original) // --5--
  },

  renderInEditMode(edited) {
    // TODO: implement me
  },

  renderInViewMode(original) {
    // TODO: implement me
  },
})