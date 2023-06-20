const CreateTodo = defineComponent({
  state() {
    return { text: '' }
  },

  render() {
    const { text } = this.state

    return h('div', {}, [
      h('label', { for: 'todo-input' }, ['New TODO']),
      h('input', {
        type: 'text',
        id: 'todo-input',
        value: text,
        on: {
          input: ({ target }) => this.updateState({ text: target.value }),
          keydown: ({ key }) => {
            if (key === 'Enter' && text.length >= 3) {
              this.addTodo()
            }
          },
        },
      }),
      h(
        'button',
        {
          disabled: text.length < 3,
          on: { click: this.addTodo },
        },
        ['Add']
      ),
    ])
  },

  addTodo() {
    this.emit('add', this.state.text)
    this.updateState({ text: '' })
  },
})