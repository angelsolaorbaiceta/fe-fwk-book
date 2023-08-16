const CreateTodo = defineComponent({
  state() {
    return { text: '' } // --1--
  },

  render() {
    const { text } = this.state

    return h('div', {}, [
      h('label', { for: 'todo-input' }, ['New TODO']),
      h('input', {
        type: 'text',
        id: 'todo-input',
        value: text, // --2--
        on: {
          input: ({ target }) => 
            this.updateState({ text: target.value }), // --3--
          keydown: ({ key }) => { // --4--
            if (key === 'Enter' && text.length >= 3) {
              this.addTodo()
            }
          },
        },
      }),
      h(
        'button',
        {
          disabled: text.length < 3, // --5--
          on: { click: this.addTodo }, // --6--
        },
        ['Add']
      ),
    ])
  },

  addTodo() { // --7--
    this.emit('add', this.state.text)
    this.updateState({ text: '' })
  },
})