export const TodosList = defineComponent({
  state() {
    return {
      isLoading: true,
      todos: [],
    }
  },

  async onMounted() {
    const todos = await fetch('https://api.example.com/todos')
    this.updateState({ isLoading: false, todos })
  },
  
  render() {
    const { isLoading, todos } = this.state

    if (isLoading) {
      return h('p', {}, ['Loading...'])
    }

    return h('ul', {}, todos.map((todo) => h('li', {}, [todo])))
  }
})